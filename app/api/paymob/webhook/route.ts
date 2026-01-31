import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyPaymobHMAC } from '@/lib/paymob/server';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Verify HMAC signature
        if (!verifyPaymobHMAC(data.obj)) {
            console.error('Invalid HMAC signature');
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            );
        }

        const transaction = data.obj;
        const supabase = await createClient();

        // Extract metadata
        const userId = transaction.order?.shipping_data?.user_id ||
            transaction.metadata?.user_id;
        const tier = transaction.order?.shipping_data?.tier ||
            transaction.metadata?.tier;
        const billingCycle = transaction.order?.shipping_data?.billing_cycle ||
            transaction.metadata?.billing_cycle;

        if (!userId || !tier || !billingCycle) {
            console.error('Missing required metadata', { userId, tier, billingCycle });
            return NextResponse.json(
                { error: 'Missing metadata' },
                { status: 400 }
            );
        }

        // Check transaction status
        if (transaction.success === true && !transaction.is_refunded) {
            // Payment successful
            const subscriptionEndDate = new Date();
            if (billingCycle === 'yearly') {
                subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
            } else {
                subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
            }

            // Update user subscription
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    subscription_tier: tier,
                    subscription_status: 'active',
                    paymob_customer_id: transaction.order?.id?.toString(),
                    paymob_subscription_id: transaction.id?.toString(),
                    subscription_end_date: subscriptionEndDate.toISOString(),
                    billing_cycle: billingCycle,
                })
                .eq('id', userId);

            if (profileError) {
                console.error('Failed to update profile:', profileError);
            }

            // Record payment
            const { error: paymentError } = await supabase
                .from('payments')
                .insert({
                    user_id: userId,
                    paymob_transaction_id: transaction.id.toString(),
                    paymob_order_id: transaction.order.id.toString(),
                    amount: transaction.amount_cents,
                    currency: transaction.currency,
                    status: 'succeeded',
                    subscription_tier: tier,
                    billing_cycle: billingCycle,
                    payment_method: transaction.source_data?.type || 'card',
                });

            if (paymentError) {
                console.error('Failed to record payment:', paymentError);
            }

            console.log(`✅ Payment successful for user ${userId}: ${tier} (${billingCycle})`);
        } else if (transaction.success === false) {
            // Payment failed
            console.log(`❌ Payment failed for transaction ${transaction.id}`);

            // Still record the failed payment for tracking
            await supabase
                .from('payments')
                .insert({
                    user_id: userId,
                    paymob_transaction_id: transaction.id.toString(),
                    paymob_order_id: transaction.order.id.toString(),
                    amount: transaction.amount_cents,
                    currency: transaction.currency,
                    status: 'failed',
                    subscription_tier: tier,
                    billing_cycle: billingCycle,
                    payment_method: transaction.source_data?.type || 'card',
                });
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: error.message || 'Webhook processing failed' },
            { status: 500 }
        );
    }
}

// Allow Paymob to POST to this endpoint
export const dynamic = 'force-dynamic';
