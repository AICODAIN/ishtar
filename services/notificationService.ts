
import { AdminOrder, UserProfile, SystemLog, Promotion, Product } from '../types';
import { logs } from '../data/adminData';
import { authUsers } from '../data/auth';

// --- Configuration ---
const SENDER_EMAIL = "ISHTAR <no-reply@ishtar.app>";
const SENDER_SMS = "ISHTAR";

// --- Core Senders (Simulation) ---

const logNotification = (type: 'email' | 'sms', recipient: string, subject: string, orderId?: string) => {
    const newLog: SystemLog = {
        id: Date.now(),
        type: 'notification',
        message: `Sent ${type.toUpperCase()} to ${recipient}: ${subject}`,
        created_at: new Date().toISOString(),
        related_order_id: orderId,
        details: { channel: type, recipient }
    };
    // Push to global logs (in-memory)
    logs.unshift(newLog); 
    console.log(`[${type.toUpperCase()}] To: ${recipient} | Subject: ${subject}`);
};

const sendEmail = async (to: string, subject: string, body: string, orderId?: string) => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 500));
    logNotification('email', to, subject, orderId);
    return true;
};

const sendSMS = async (phone: string, message: string, orderId?: string) => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 500));
    logNotification('sms', phone, message, orderId);
    return true;
};

// --- Business Logic ---

/**
 * Triggered when Order Status changes (Placed, Paid, Shipped, Delivered)
 */
export const notifyOrderStatusChange = async (order: AdminOrder, newStatus: string) => {
    // 1. Find User to check preferences
    // In a real app, we fetch by ID. Here we match email from authUsers mock.
    const user = authUsers.find(u => u.email.toLowerCase() === order.email.toLowerCase());
    
    // Default to true if user not found (guest) or if preference exists
    const shouldNotify = user ? user.preferences.notify_order_status : true;

    if (!shouldNotify) {
        console.log(`[Notification Skipped] User ${order.email} opted out of order updates.`);
        return;
    }

    // 2. Construct Messages
    let subject = '';
    let body = '';
    let sms = '';

    const isAr = user?.language === 'AR'; // Use user preference or default

    switch (newStatus.toLowerCase()) {
        case 'pending': // Usually "Placed"
            subject = isAr ? `تم استلام طلبك #${order.id}` : `Order Received #${order.id}`;
            body = isAr 
                ? `مرحباً ${order.customer}،\nشكراً لتسوقك من عشتار. تم استلام طلبك ونحن بانتظار الدفع/التأكيد.`
                : `Dear ${order.customer},\nThank you for shopping with Ishtar. We have received your order and are awaiting confirmation.`;
            sms = isAr ? `عشتار: تم استلام طلبك #${order.id}` : `ISHTAR: Order #${order.id} received.`;
            break;
        
        case 'processing': // Usually "Paid"
            subject = isAr ? `تم تأكيد الطلب #${order.id}` : `Order Confirmed #${order.id}`;
            body = isAr 
                ? `تم تأكيد الدفع لطلبك رقم #${order.id}. يجري حالياً تجهيز القطع الفاخرة الخاصة بك.`
                : `Payment confirmed for Order #${order.id}. We are now preparing your luxury items.`;
            sms = isAr ? `عشتار: تم تأكيد طلبك #${order.id} وجاري التجهيز.` : `ISHTAR: Order #${order.id} confirmed & processing.`;
            break;

        case 'shipped':
            subject = isAr ? `شحنتك في الطريق! طلب #${order.id}` : `Your Order #${order.id} has Shipped!`;
            body = isAr 
                ? `بشرى سارة! شحنتك رقم ${order.tracking_number || ''} مع ${order.carrier_id || 'شركة الشحن'} في طريقها إليك.`
                : `Good news! Shipment ${order.tracking_number || ''} via ${order.carrier_id || 'Carrier'} is on its way.`;
            sms = isAr ? `عشتار: طلبك #${order.id} تم شحنه. تتبع: ${order.tracking_number}` : `ISHTAR: Order #${order.id} shipped. Track: ${order.tracking_number}`;
            break;

        case 'delivered':
            subject = isAr ? `تم توصيل طلبك #${order.id}` : `Delivered: Order #${order.id}`;
            body = isAr 
                ? `نأمل أن تنال اختياراتك إعجابك. شكراً لثقتك في عشتار.`
                : `We hope you enjoy your exquisite choices. Thank you for choosing Ishtar.`;
            sms = isAr ? `عشتار: تم توصيل طلبك #${order.id}. شكراً لك.` : `ISHTAR: Order #${order.id} delivered. Enjoy!`;
            break;
            
        case 'on_hold': // High Risk
             // Usually only email, maybe generic
             subject = isAr ? `تحديث بخصوص طلبك #${order.id}` : `Update regarding Order #${order.id}`;
             body = isAr ? `يرجى العلم أن طلبك تحت المراجعة للتأكد من تفاصيل الدفع.` : `Please note your order is currently under standard review.`;
             break;
    }

    // 3. Send
    if (subject) {
        await sendEmail(order.email, subject, body, order.id);
        // Send SMS only for time-sensitive updates
        if (sms && (newStatus === 'shipped' || newStatus === 'delivered' || newStatus === 'processing')) {
            await sendSMS(order.phone, sms, order.id);
        }
    }
};

/**
 * Triggered by Marketing Bots
 */
export const notifyPromotion = async (promotion: Promotion, targetUsers: UserProfile[] = []) => {
    // If no specific targets, assume all opted-in users (mocking with authUsers)
    const recipients = targetUsers.length > 0 ? targetUsers : authUsers;

    console.log(`[Promo Bot] Starting blast for: ${promotion.name_en}`);

    let sentCount = 0;

    for (const user of recipients) {
        if (!user.preferences.notify_promotions) continue;

        const isAr = user.language === 'AR';
        const subject = isAr ? `✨ عرض جديد: ${promotion.name_ar}` : `✨ New Offer: ${promotion.name_en}`;
        const body = isAr 
            ? `${promotion.name_ar}\n${promotion.description || ''}\nاستخدم الكود عند الدفع!`
            : `${promotion.name_en}\n${promotion.description || ''}\nShop now!`;

        await sendEmail(user.email, subject, body);
        sentCount++;
    }

    // Log the bulk action
    logs.unshift({
        id: Date.now(),
        type: 'notification',
        message: `Promotion Blast '${promotion.name_en}' sent to ${sentCount} users.`,
        created_at: new Date().toISOString(),
        details: { promoId: promotion.id, count: sentCount }
    });
};

export const notifyHighRiskAlert = async (order: AdminOrder) => {
    // Internal Email to Admins
    await sendEmail("risk-team@ishtar.app", `HIGH RISK ALERT: Order ${order.id}`, `Fraud Score: ${order.fraud_score}. Please review immediately.`, order.id);
};

export const notifyHighRiskImport = async (product: Product) => {
    // Internal Email to Admins regarding suspicious product pricing/metadata
    await sendEmail(
        "admin@ishtar.app", 
        `IMPORT RISK: ${product.brand} - ${product.name}`, 
        `A high-risk item has been imported.\n\nProduct: ${product.name}\nBrand: ${product.brand}\nCalculated Price: ${product.final_price_sar} SAR\nTier: ${product.brand_tier}\n\nReason: Price is suspiciously low for this Tier.\n\nPlease review in Admin Dashboard.`,
        product.id
    );
};
