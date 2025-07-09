import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function retrieveSubscription(subscriptionId: string) {
    try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
            expand: ['items.data.price']
        });
        return subscription;
    } catch (error: any) {
        return { error_message: error.message };
    }
}

export async function createCreditPurchasePaymentIntent(data: {
    customer_id: string;
    amount: number;
    credits: number;
    description?: string;
}) {
    try {
        const intent = await stripe.paymentIntents.create({
            customer: data.customer_id,
            amount: data.amount * 100, // Convert to cents
            currency: 'usd',
            description: data.description || `Purchase ${data.credits} credits`,
            automatic_payment_methods: { enabled: true },
            metadata: {
                type: 'credit_purchase',
                credits: data.credits.toString()
            }
        });

        return {
            payment_id: intent.id,
            client_secret: intent.client_secret,
            customer_id: data.customer_id,
        };
    } catch (error: any) {
        return { error_message: error.message };
    }
}

export async function createSubscriptionCheckout(data: {
    customer_id: string;
    price_id: string;
    success_url: string;
    cancel_url: string;
}) {
    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: data.price_id,
                    quantity: 1,
                },
            ],
            customer: data.customer_id,
            success_url: data.success_url,
            cancel_url: data.cancel_url,
        });

        return { 
            session_id: session.id,
            url: session.url 
        };
    } catch (error: any) {
        return { error_message: error.message };
    }
}

export async function createOrUpdateSubscription(data: {
    customer_id: string;
    price_id: string;
    customer_email: string;
    customer_name?: string;
    metadata?: Record<string, string>;
}) {
    try {
        // If no customer_id provided, try to find customer by email or create one
        let customerId = data.customer_id;
        
        if (!customerId || customerId === '') {
            console.log('Creating customer for email:', data.customer_email);
            
            // Try to create customer using the imported function
            const customer = await stripe.customers.create({
                email: data.customer_email,
                name: data.customer_name || data.customer_email,
                metadata: {
                    ...data.metadata
                }
            });
            
            customerId = customer.id;
        }

        // Create the subscription
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [
                {
                    price: data.price_id,
                    quantity: 1,
                },
            ],
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent'],
            metadata: data.metadata || {}
        });

        // Get client secret from the subscription
        let clientSecret = null;
        if (subscription.latest_invoice && 
            typeof subscription.latest_invoice === 'object' &&
            'payment_intent' in subscription.latest_invoice &&
            subscription.latest_invoice.payment_intent &&
            typeof subscription.latest_invoice.payment_intent === 'object' &&
            'client_secret' in subscription.latest_invoice.payment_intent) {
            clientSecret = subscription.latest_invoice.payment_intent.client_secret;
        }

        return {
            customer_id: customerId,
            subscription_id: subscription.id,
            client_secret: clientSecret
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Stripe subscription error:', errorMessage);
        return { error_message: errorMessage };
    }
}

// Re-export functions from the main stripe.ts file
export * from './stripe';
