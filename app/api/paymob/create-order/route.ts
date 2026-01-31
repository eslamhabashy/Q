import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
    getPaymobAuthToken,
    createPaymobOrder,
    getPaymobPaymentKey,
    getSubscriptionPricing,
} from '@/lib/paymob/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { tier, billingCycle, paymentMethod = 'card' } = await request.json();

        // Validate input
        if (!tier || !billingCycle) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (!['basic', 'pro', 'premium'].includes(tier)) {
            return NextResponse.json(
                { error: 'Invalid tier' },
                { status: 400 }
            );
        }

        if (!['monthly', 'yearly'].includes(billingCycle)) {
            return NextResponse.json(
                { error: 'Invalid billing cycle' },
                { status: 400 }
            );
        }

        // Get user profile (optional - use auth data as fallback)
        const { data: profile } = await supabase
            .from('profiles')
            .select('email, full_name, phone')
            .eq('id', user.id)
            .single();

        // Use profile data if available, otherwise fallback to user auth data
        const userEmail = profile?.email || user.email || 'user@qanunak.com';
        const userName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
        const userPhone = profile?.phone || user.user_metadata?.phone || '+201000000000';

        // Get pricing
        const amountCents = getSubscriptionPricing(tier, billingCycle);

        if (!amountCents) {
            return NextResponse.json(
                { error: 'Invalid pricing configuration' },
                { status: 500 }
            );
        }

        // Step 1: Get auth token
        const authToken = await getPaymobAuthToken();

        // Step 2: Create order
        const order = await createPaymobOrder(
            authToken,
            amountCents,
            user.id,
            tier,
            billingCycle
        );

        // Prepare billing data
        const nameParts = userName.split(' ');
        const billingData = {
            email: userEmail,
            first_name: nameParts[0] || 'User',
            last_name: nameParts.slice(1).join(' ') || 'Qanunak',
            phone_number: userPhone,
        };

        // Determine integration ID based on payment method
        let integrationId: string;
        switch (paymentMethod) {
            case 'wallet':
                integrationId = process.env.PAYMOB_INTEGRATION_ID_WALLET!;
                break;
            case 'installments':
                integrationId = process.env.PAYMOB_INTEGRATION_ID_INSTALLMENTS!;
                break;
            case 'card':
            default:
                integrationId = process.env.PAYMOB_INTEGRATION_ID_CARD!;
                break;
        }

        if (!integrationId) {
            return NextResponse.json(
                { error: 'Payment method not configured' },
                { status: 500 }
            );
        }

        // Step 3: Get payment key
        const paymentToken = await getPaymobPaymentKey(
            authToken,
            order.id,
            amountCents,
            billingData,
            integrationId,
            user.id,
            tier,
            billingCycle
        );

        // Get iframe ID from environment
        const iframeId = process.env.PAYMOB_IFRAME_ID || '870816';

        return NextResponse.json({
            success: true,
            paymentToken,
            orderId: order.id,
            iframeId,
            iframeUrl: `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentToken}`,
        });
    } catch (error: any) {
        console.error('Paymob order creation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create payment order' },
            { status: 500 }
        );
    }
}
