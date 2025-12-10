
import { GoogleGenAI, LiveServerMessage, Modality, Type } from "@google/genai";

// Models Configuration
const MODEL_TEXT_SEARCH = 'gemini-2.5-flash';
const MODEL_TEXT_THINKING = 'gemini-3-pro-preview';
const MODEL_IMAGE_GEN = 'gemini-3-pro-image-preview'; 
const MODEL_IMAGE_EDIT = 'gemini-2.5-flash-image';
const MODEL_VEO_FAST = 'veo-3.1-fast-generate-preview';
const MODEL_TTS = 'gemini-2.5-flash-preview-tts';
const MODEL_LIVE = 'gemini-2.5-flash-native-audio-preview-09-2025';

// --- Initialization ---

export const checkVeoKey = async (): Promise<boolean> => {
  const win = window as any;
  if (win.aistudio && win.aistudio.hasSelectedApiKey) {
    return await win.aistudio.hasSelectedApiKey();
  }
  return true; // Fallback for dev/local or when environment is pre-configured
};

export const promptVeoKey = async (): Promise<void> => {
  const win = window as any;
  if (win.aistudio && win.aistudio.openSelectKey) {
    await win.aistudio.openSelectKey();
  }
};

// Access API Key dynamically to handle updates from the selection dialog
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Text, Thinking & Search ---

export const generateThinkingResponse = async (prompt: string): Promise<string> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: MODEL_TEXT_THINKING,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 1024 }, // Efficient budget for stylist reasoning
        systemInstruction: "You are Ishtar, an elite personal stylist and luxury concierge. You possess deep knowledge of high fashion, horology, and fine jewelry. Your tone is elegant, sophisticated, and helpful. When answering, think deeply about the user's request to provide curated and exquisite recommendations based on current trends and timeless elegance.",
      },
    });
    return response.text || "I am analyzing the intricate details of your request. Please allow me a moment.";
  } catch (error) {
    console.error("Thinking Error:", error);
    return "Our senior stylist is currently unavailable to perform deep analysis. Please try again.";
  }
};

export const generateChatResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  useSearch: boolean = false,
  useMaps: boolean = false
) => {
  const ai = getAI();
  const tools: any[] = [];
  
  // Add Grounding Tools
  if (useSearch) tools.push({ googleSearch: {} });
  if (useMaps) tools.push({ googleMaps: {} });

  // Use Flash for Grounding/Speed, Pro for Reasoning (if not searching)
  const model = (useSearch || useMaps) ? MODEL_TEXT_SEARCH : MODEL_TEXT_THINKING;

  const chat = ai.chats.create({
    model: model,
    history: history,
    config: {
      tools: tools.length > 0 ? tools : undefined,
      systemInstruction: "You are Ishtar, a high-end luxury shopping assistant. You are sophisticated, helpful, and knowledgeable about fashion, perfumes, and logistics. Keep responses elegant and concise.",
    },
  });

  const response = await chat.sendMessage({ message });
  
  // Extract grounding chunks
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const urls: Array<{ title: string; uri: string }> = [];

  groundingChunks.forEach((chunk: any) => {
    if (chunk.web) {
      urls.push({ title: chunk.web.title, uri: chunk.web.uri });
    }
    if (chunk.maps && chunk.maps.uri) {
      urls.push({ title: chunk.maps.title, uri: chunk.maps.uri });
    }
  });

  return { text: response.text, urls };
};

// --- Image Generation & Editing ---

export const generateLuxuryImage = async (prompt: string, aspectRatio: string = "1:1", size: string = "1K") => {
  // Check key for Pro Image model
  const hasKey = await checkVeoKey();
  if (!hasKey) {
    await promptVeoKey();
  }

  const ai = getAI(); // Re-init to pick up key
  
  try {
    const response = await ai.models.generateContent({
      model: MODEL_IMAGE_GEN,
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: size as any
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (e) {
    console.error("Image Gen Error", e);
    throw e;
  }
};

export const editImage = async (base64Image: string, prompt: string) => {
  const ai = getAI();
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
  
  try {
    const response = await ai.models.generateContent({
      model: MODEL_IMAGE_EDIT,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: cleanBase64 } },
          { text: prompt }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    return null;
  } catch (e) {
      console.error("Edit Image Error", e);
      throw e;
  }
};

// --- Video Generation (Veo) ---

export const generateMarketingVideo = async (prompt: string, aspectRatio: '16:9' | '9:16' = '16:9') => {
   // Check key for Veo
   const hasKey = await checkVeoKey();
   if (!hasKey) {
     await promptVeoKey();
   }
   
   const ai = getAI(); // Use fresh instance

   try {
     let operation = await ai.models.generateVideos({
       model: MODEL_VEO_FAST,
       prompt: prompt,
       config: {
         numberOfVideos: 1,
         resolution: '720p',
         aspectRatio: aspectRatio
       }
     });

     // Poll for completion with exponential backoff logic (simplified here to constant for UX)
     while (!operation.done) {
       await new Promise(resolve => setTimeout(resolve, 5000));
       operation = await ai.operations.getVideosOperation({ operation: operation });
     }

     const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
     if (uri) {
       // The response body contains MP4 bytes. Must append API key.
       // Dynamic access to env ensures we use the selected key
       const vidRes = await fetch(`${uri}&key=${process.env.API_KEY}`);
       const blob = await vidRes.blob();
       return URL.createObjectURL(blob);
     }
     return null;
   } catch (e) {
     console.error("Veo Gen Error", e);
     throw e;
   }
}

// --- TTS ---

export const speakText = async (text: string) => {
    const ai = getAI();
    try {
      const response = await ai.models.generateContent({
          model: MODEL_TTS,
          contents: [{ parts: [{ text }] }],
          config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                  voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } } 
              }
          }
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
          const binaryString = atob(base64Audio);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
          }
          const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);
          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContext.destination);
          source.start();
      }
    } catch (e) {
      console.error("TTS Error", e);
    }
};

// --- Live API (Real-time Audio) ---

export class LiveClient {
    private inputAudioContext: AudioContext | null = null;
    private outputAudioContext: AudioContext | null = null;
    private nextStartTime = 0;
    private sessionPromise: Promise<any> | null = null;
    private outputNode: GainNode | null = null;

    constructor() {}

    async connect(onTranscription: (text: string, isUser: boolean) => void) {
        const ai = getAI();
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        
        // Input: 16kHz required by Gemini Live
        this.inputAudioContext = new AudioContextClass({ sampleRate: 16000 });
        // Output: 24kHz returned by Gemini Live
        this.outputAudioContext = new AudioContextClass({ sampleRate: 24000 });
        
        this.outputNode = this.outputAudioContext.createGain();
        this.outputNode.connect(this.outputAudioContext.destination);

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        this.sessionPromise = ai.live.connect({
            model: MODEL_LIVE,
            callbacks: {
                onopen: () => {
                    if (!this.inputAudioContext) return;
                    const source = this.inputAudioContext.createMediaStreamSource(stream);
                    const scriptProcessor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);
                    
                    scriptProcessor.onaudioprocess = (e) => {
                        const inputData = e.inputBuffer.getChannelData(0);
                        const pcmBlob = this.createBlob(inputData);
                        
                        // Critical: Only send after session resolves
                        this.sessionPromise?.then(session => {
                            session.sendRealtimeInput({ media: pcmBlob });
                        });
                    };
                    
                    source.connect(scriptProcessor);
                    scriptProcessor.connect(this.inputAudioContext.destination);
                },
                onmessage: async (msg: LiveServerMessage) => {
                     // Handle Transcription
                     if (msg.serverContent?.outputTranscription) {
                        onTranscription(msg.serverContent.outputTranscription.text, false);
                     } else if (msg.serverContent?.inputTranscription) {
                        onTranscription(msg.serverContent.inputTranscription.text, true);
                     }

                     // Handle Audio Output
                     const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                     if (audioData && this.outputAudioContext && this.outputNode) {
                        // Ensure gapless playback
                        this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
                        
                        const audioBuffer = await this.decodeAudioData(
                            this.decode(audioData), 
                            this.outputAudioContext, 
                            24000, 
                            1
                        );
                        
                        const source = this.outputAudioContext.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(this.outputNode);
                        source.start(this.nextStartTime);
                        this.nextStartTime += audioBuffer.duration;
                     }
                     
                     // Handle Interruption
                     if (msg.serverContent?.interrupted) {
                         this.nextStartTime = 0;
                     }
                },
                onerror: (e) => console.error("Live API Error:", e),
                onclose: () => console.log("Live session closed")
            },
            config: {
                responseModalities: [Modality.AUDIO], // Exclusive modality
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
                systemInstruction: "You are Ishtar, an elite personal styling assistant for a luxury marketplace. You specialize in fashion, styling, and luxury goods. Your tone is sophisticated, helpful, and concise.",
                inputAudioTranscription: {},
                outputAudioTranscription: {}
            }
        });
    }

    // Convert Float32 audio to PCM 16-bit
    private createBlob(data: Float32Array): any {
        const l = data.length;
        const int16 = new Int16Array(l);
        for (let i = 0; i < l; i++) {
            // Scale float (-1.0 to 1.0) to Int16
            int16[i] = data[i] * 32768;
        }
        
        let binary = '';
        const bytes = new Uint8Array(int16.buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        
        return {
            data: btoa(binary),
            mimeType: 'audio/pcm;rate=16000'
        };
    }

    private decode(base64: string) {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }

    private async decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) {
        const dataInt16 = new Int16Array(data.buffer);
        const frameCount = dataInt16.length / numChannels;
        const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
        for (let channel = 0; channel < numChannels; channel++) {
            const channelData = buffer.getChannelData(channel);
            for (let i = 0; i < frameCount; i++) {
                channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
            }
        }
        return buffer;
    }

    async disconnect() {
       if (this.inputAudioContext) {
           this.inputAudioContext.close();
           this.inputAudioContext = null;
       }
       if (this.outputAudioContext) {
           this.outputAudioContext.close();
           this.outputAudioContext = null;
       }
       // Note: session.close() is not explicitly exposed on the promise wrapper in this SDK version
       // but closing AudioContext stops the stream.
    }
}
