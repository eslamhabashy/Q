// Paymob Server API
const PAYMOB_API_URL = 'https://accept.paymob.com/api';

interface PaymobAuthResponse {
    token: string;
}

interface PaymobOrderResponse {
    id: number;
    [key: string]: any;
}

interface PaymobPaymentKeyResponse {
    token: string;
}

/**
 * Get authentication token from Paymob
 */
export async function getPaymobAuthToken(): Promise<string> {
    const response = await fetch(`${PAYMOB_API_URL}/auth/tokens`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            api_key: process.env.PAYMOB_API_KEY,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to get Paymob auth token');
    }

    const data: PaymobAuthResponse = await response.json();
    return data.token;
}

/**
 * Create order in Paymob
 */
export async function createPaymobOrder(
    authToken: string,
    amountCents: number,
    userId: string,
    tier: string,
    billingCycle: string
): Promise<PaymobOrderResponse> {
    const response = await fetch(`${PAYMOB_API_URL}/ecommerce/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            auth_token: authToken,
            delivery_needed: 'false',
            amount_cents: amountCents.toString(),
            currency: 'EGP',
            merchant_order_id: `${userId}_${tier}_${billingCycle}_${Date.now()}`,
            items: [
                {
                    name: `Qanunak ${tier.charAt(0).toUpperCase() + tier.slice(1)} Subscription`,
                    amount_cents: amountCents.toString(),
                    description: `${tier} subscription - ${billingCycle} billing`,
                    quantity: '1',
                },
            ],
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to create Paymob order');
    }

    return await response.json();
}

/**
 * Get payment key for iframe
 */
export async function getPaymobPaymentKey(
    authToken: string,
    orderId: number,
    amountCents: number,
    billingData: {
        email: string;
        first_name: string;
        last_name: string;
        phone_number: string;
    },
    integrationId: string,
    userId: string,
    tier: string,
    billingCycle: string
): Promise<string> {
    const response = await fetch(`${PAYMOB_API_URL}/acceptance/payment_keys`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            auth_token: authToken,
            amount_cents: amountCents.toString(),
            expiration: 3600, // 1 hour
            order_id: orderId.toString(),
            billing_data: {
                apartment: 'NA',
                email: billingData.email,
                floor: 'NA',
                first_name: billingData.first_name,
                street: 'NA',
                building: 'NA',
                phone_number: billingData.phone_number,
                shipping_method: 'NA',
                postal_code: 'NA',
                city: 'Cairo',
                country: 'EG',
                last_name: billingData.last_name,
                state: 'Cairo',
            },
            currency: 'EGP',
            integration_id: parseInt(integrationId),
            lock_order_when_paid: 'true',
            metadata: {
                user_id: userId,
                tier,
                billing_cycle: billingCycle,
            },
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to get Paymob payment key');
    }

    const data: PaymobPaymentKeyResponse = await response.json();
    return data.token;
}

/**
 * Verify HMAC signature from Paymob webhook
 */
export function verifyPaymobHMAC(data: any): boolean {
    const crypto = require('crypto');

    const {
        amount_cents,
        created_at,
        currency,
        error_occured,
        has_parent_transaction,
        id,
        integration_id,
        is_3d_secure,
        is_auth,
        is_capture,
        is_refunded,
        is_standalone_payment,
        is_voided,
        order,
        owner,
        pending,
        source_data_pan,
        source_data_sub_type,
        source_data_type,
        success,
    } = data;

    const concatenatedString = `${amount_cents}${created_at}${currency}${error_occured}${has_parent_transaction}${id}${integration_id}${is_3d_secure}${is_auth}${is_capture}${is_refunded}${is_standalone_payment}${is_voided}${order}${owner}${pending}${source_data_pan}${source_data_sub_type}${source_data_type}${success}`;

    const hmac = crypto
        .createHmac('sha512', process.env.PAYMOB_HMAC_SECRET!)
        .update(concatenatedString)
        .digest('hex');

    return hmac === data.hmac;
}

/**
 * Get pricing for subscription tiers (in piasters/cents)
 */
export function getSubscriptionPricing(tier: string, billingCycle: string): number {
    const pricing: Record<string, Record<string, number>> = {
        basic: {
            monthly: 10000, // 100 EGP = 10000 piasters
            yearly: 96000,  // 960 EGP (20% discount)
        },
        pro: {
            monthly: 30000, // 300 EGP
            yearly: 288000, // 2880 EGP (20% discount)
        },
        premium: {
            monthly: 60000, // 600 EGP
            yearly: 576000, // 5760 EGP (20% discount)
        },
    };

    return pricing[tier]?.[billingCycle] || 0;
}
