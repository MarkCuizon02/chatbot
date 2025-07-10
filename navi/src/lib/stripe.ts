import Stripe from 'stripe';
import { CustomerData, PaymentMethodData } from '@/types/stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Customer Management
export async function findCustomerByEmail(email: string) {
    try {
        const customers = await stripe.customers.search({
            query: `email:'${email}'`,
        });
        return customers.data.length > 0 ? customers.data[0] : null;
    } catch (error) {
        console.error('Error searching for customer:', error);
        throw new Error(`Failed to search customer: ${error.message}`);
    }
}

export async function retrieveCustomer(customer_id: string) {
    try {
        const customer = await stripe.customers.retrieve(customer_id, { 
            expand: ['subscriptions'] 
        });
        return customer;
    } catch (error) {
        console.error('Error retrieving customer:', error);
        throw new Error(`Failed to retrieve customer: ${error.message}`);
    }
}

export async function createOrRetrieveCustomer(data: CustomerData) {
    try {
        // First, try to find existing customer by email
        const existingCustomer = await findCustomerByEmail(data.email);
        
        if (existingCustomer) {
            console.log(`Found existing customer: ${existingCustomer.id}`);
            return { customer_id: existingCustomer.id, customer: existingCustomer };
        }
        
        // If no customer exists, create a new one
        console.log(`Creating new customer for email: ${data.email}`);
        const customer = await stripe.customers.create({
            name: data.name,
            email: data.email,
            phone: data.phone,
        });
        
        return { customer_id: customer.id, customer };
    } catch (error) {
        console.error('Error in createOrRetrieveCustomer:', error);
        throw new Error(`Failed to create or retrieve customer: ${error.message}`);
    }
}

export async function createCustomer(data: CustomerData) {
    // Deprecated: Use createOrRetrieveCustomer instead
    console.warn('createCustomer is deprecated. Use createOrRetrieveCustomer instead.');
    return createOrRetrieveCustomer(data);
}

export async function updateCustomer(data: CustomerData & { customer_id: string }) {
    try {
        const customer = await stripe.customers.update(data.customer_id, {
            name: data.name,
            email: data.email,
            phone: data.phone,
        });
        return { customer_id: customer.id, customer };
    } catch (error) {
        console.error('Error updating customer:', error);
        throw new Error(`Failed to update customer: ${error.message}`);
    }
}

export async function updateCustomerPaymentMethod(customer_id: string, payment_method_id: string) {
    try {
        const customer = await stripe.customers.update(customer_id, {
            invoice_settings: {
                default_payment_method: payment_method_id,
            },
        });
        return { customer_id: customer.id, customer };
    } catch (error) {
        console.error('Error updating customer payment method:', error);
        throw new Error(`Failed to update customer payment method: ${error.message}`);
    }
}

export async function getCustomerPaymentMethods(customer_id: string) {
    try {
        const paymentMethods = await stripe.customers.listPaymentMethods(customer_id, {
            type: 'card',
            limit: 10,
        });
        return paymentMethods.data;
    } catch (error) {
        console.error('Error fetching customer payment methods:', error);
        throw new Error(`Failed to fetch payment methods: ${error.message}`);
    }
}

// Subscription Management
export async function cancelSubscription(subscription_id: string) {
    try {
        const canceledSubscription = await stripe.subscriptions.cancel(subscription_id);
        return { success: true, subscription: canceledSubscription };
    } catch (error) {
        console.error('Error canceling subscription:', error);
        throw new Error(`Failed to cancel subscription: ${error.message}`);
    }
}

export async function createSubscription(customer_id: string, amount: number, payment_method_types: string, price_id: string) {
    try {
        const subscription = await stripe.subscriptions.create({
            customer: customer_id,
            items: [
                {
                    price: price_id,
                    quantity: amount,
                },
            ],
            payment_behavior: 'default_incomplete',
            payment_settings: {
                payment_method_types: [
                    payment_method_types as Stripe.SubscriptionCreateParams.PaymentSettings.PaymentMethodType
                ],
                save_default_payment_method: 'on_subscription'
            },
            expand: ['latest_invoice.payment_intent'],
        });

        return {
            customer_id: customer_id,
            subscription_id: subscription.id,
            subscription,
        };
    } catch (error) {
        console.error('Error creating subscription:', error);
        throw new Error(`Failed to create subscription: ${error.message}`);
    }
}

export async function updateSubscription(subscription_id: string, data: { subscription_item_id: string; price_id: string; amount: number }, useProration: boolean = true) {
    try {
        const subscription = await stripe.subscriptions.update(subscription_id, {
            items: [
                {
                    id: data.subscription_item_id,
                    price: data.price_id,
                    quantity: data.amount,
                },
            ],
            collection_method: 'charge_automatically',
            payment_behavior: 'default_incomplete',
            proration_behavior: useProration ? 'create_prorations' : 'none',
            expand: ['latest_invoice.payment_intent'],
            payment_settings: {
                save_default_payment_method: 'on_subscription',
            },
        });

        return { subscription_id: subscription.id, subscription };
    } catch (error) {
        console.error('Error updating subscription:', error);
        throw new Error(`Failed to update subscription: ${error.message}`);
    }
}

// More than 5 days - with proration
export async function updateSubscriptionWithProration(subscription_id: string, data: { subscription_item_id: string; price_id: string; amount: number }) {
    return updateSubscription(subscription_id, data, true);
}

// Less than 5 days - without proration
export async function updateSubscriptionWithoutProration(subscription_id: string, data: { subscription_item_id: string; price_id: string; amount: number }) {
    return updateSubscription(subscription_id, data, false);
}

export async function retrieveSubscription(subscription_id: string) {
    try {
        const subscription = await stripe.subscriptions.retrieve(subscription_id, { 
            expand: [
                'latest_invoice.payment_intent',
                'items.data.price',
            ] 
        });
        return subscription;
    } catch (error) {
        console.error('Error retrieving subscription:', error);
        throw new Error(`Failed to retrieve subscription: ${error.message}`);
    }
}

export async function retrieveCustomerSubscriptions(customer_id: string) {
    try {
        const subscriptions = await stripe.subscriptions.list({
            customer: customer_id,
            limit: 100,
        });
        return subscriptions.data;
    } catch (error) {
        console.error('Error retrieving customer subscriptions:', error);
        throw new Error(`Failed to retrieve customer subscriptions: ${error.message}`);
    }
}

// Invoice Management
export async function retrieveInvoice(invoice_id: string) {
    try {
        const invoice = await stripe.invoices.retrieve(invoice_id, { 
            expand: ['payment_intent'] 
        });
        return invoice;
    } catch (error) {
        console.error('Error retrieving invoice:', error);
        throw new Error(`Failed to retrieve invoice: ${error.message}`);
    }
}

export async function retrieveCustomerInvoices(customer_id: string) {
    try {
        const invoices = await stripe.invoices.list({
            customer: customer_id,
            limit: 100,
        });
        return invoices.data;
    } catch (error) {
        console.error('Error retrieving customer invoices:', error);
        throw new Error(`Failed to retrieve customer invoices: ${error.message}`);
    }
}

// Payment Methods Management
export async function createPaymentMethod(data: PaymentMethodData) {
    try {
        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: data.card_number,
                exp_month: data.exp_month,
                exp_year: data.exp_year,
                cvc: data.cvc,
            },
            billing_details: {
                name: `${data.fname} ${data.lname}`,
                email: data.email,
                phone: data.phone,
            },
        });

        return { payment_method_id: paymentMethod.id, payment_method: paymentMethod };
    } catch (error) {
        console.error('Error creating payment method:', error);
        throw new Error(`Failed to create payment method: ${error.message}`);
    }
}

export async function updatePaymentMethod(payment_method_id: string, data: PaymentMethodData) {
    try {
        const paymentMethod = await stripe.paymentMethods.update(payment_method_id, {
            billing_details: {
                name: `${data.fname} ${data.lname}`,
                email: data.email,
                phone: data.phone,
            },
        });

        return { payment_method_id: paymentMethod.id, payment_method: paymentMethod };
    } catch (error) {
        console.error('Error updating payment method:', error);
        throw new Error(`Failed to update payment method: ${error.message}`);
    }
}

export async function attachPaymentMethodToCustomer(customer_id: string, payment_method_id: string) {
    try {
        const paymentMethod = await stripe.paymentMethods.attach(payment_method_id, {
            customer: customer_id,
        });

        // Update the customer's default payment method
        await stripe.customers.update(customer_id, {
            invoice_settings: {
                default_payment_method: payment_method_id,
            },
        });

        return { payment_method_id: paymentMethod.id, payment_method: paymentMethod };
    } catch (error) {
        console.error('Error attaching payment method to customer:', error);
        throw new Error(`Failed to attach payment method: ${error.message}`);
    }
}

export async function detachPaymentMethod(payment_method_id: string) {
    try {
        const paymentMethod = await stripe.paymentMethods.detach(payment_method_id);
        return { success: true, payment_method: paymentMethod };
    } catch (error) {
        console.error('Error detaching payment method:', error);
        throw new Error(`Failed to detach payment method: ${error.message}`);
    }
}


// Payment Intent Management - Optimized for Credit Purchases
export async function createCreditPurchasePaymentIntent(data: { 
    email: string; 
    name?: string; 
    phone?: string; 
    amount: number; 
    credits: number; 
    accountId: string; 
    description?: string; 
}) {
    try {
        // Use optimized customer lookup/creation
        const customerResult = await createOrRetrieveCustomer({
            email: data.email,
            name: data.name || data.email,
            phone: data.phone,
        });

        const intent = await stripe.paymentIntents.create({
            customer: customerResult.customer_id,
            amount: data.amount * 100, // Convert to cents
            currency: 'usd',
            description: data.description || `Credit purchase: ${data.credits} credits`,
            automatic_payment_methods: { enabled: true },
            metadata: {
                type: 'credit_purchase',
                credits: data.credits.toString(),
                accountId: data.accountId,
            },
        });

        return {
            payment_id: intent.id,
            client_secret: intent.client_secret,
            customer_id: customerResult.customer_id,
            customer: customerResult.customer,
        };
    } catch (error) {
        console.error('Error creating credit purchase payment intent:', error);
        throw new Error(`Failed to create credit purchase payment intent: ${error.message}`);
    }
}

export async function oneTimePayment(data: { customer_id?: string; amount: number; ddecation?: string }) {
    try {
        let customer_id = data.customer_id;
        
        if (customer_id) {
            // Validate existing customer
            try {
                const customer = await retrieveCustomer(customer_id);
                customer_id = customer.id;
            } catch (error) {
                console.error('Customer validation failed:', error);
                throw new Error('Invalid customer ID provided');
            }
        }

        const intent = await stripe.paymentIntents.create({
            customer: customer_id,
            amount: data.amount * 100,
            currency: 'usd',
            description: data.ddecation || "Amount",
            automatic_payment_methods: { enabled: true },
        });

        return {
            payment_id: intent.id,
            client_secret: intent.client_secret,
            customer_id: customer_id,
        };
    } catch (error) {
        console.error('Error creating one-time payment:', error);
        throw new Error(`Failed to create payment intent: ${error.message}`);
    }
}

export async function updatePaymentIntent(data: { payment_id: string; customer_id: string; amount: number; ddecation?: string; email?: string }) {
    try {
        const intent = await stripe.paymentIntents.update(data.payment_id, {
            customer: data.customer_id,
            amount: data.amount * 100,
            currency: 'usd',
            description: data.ddecation || "Amount",
            receipt_email: data.email,
        });

        return {
            payment_id: intent.id,
            client_secret: intent.client_secret,
            payment_intent: intent,
        };
    } catch (error) {
        console.error('Error updating payment intent:', error);
        throw new Error(`Failed to update payment intent: ${error.message}`);
    }
}

// Checkout Session Management
export async function createSubscriptionCheckoutSession(data: { 
    amount: number; 
    price_id: string; 
    customer_id?: string; 
    email?: string;
    name?: string;
    phone?: string;
    success_url?: string; 
}) {
    try {
        let customer_id = data.customer_id;

        // If no customer_id provided but we have email, create/retrieve customer
        if (!customer_id && data.email) {
            const customerResult = await createOrRetrieveCustomer({
                email: data.email,
                name: data.name || data.email,
                phone: data.phone,
            });
            customer_id = customerResult.customer_id;
        }

        if (!customer_id) {
            throw new Error('Customer ID or email is required');
        }

        // Create a Stripe Checkout Session for subscription (embedded)
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: data.price_id,
                    quantity: data.amount,
                },
            ],
            customer: customer_id,
            ui_mode: 'embedded',
            return_url: data.success_url || 'http://localhost:3000/subscribe/thank-you?session_id={CHECKOUT_SESSION_ID}',
        });

        return { 
            client_secret: session.client_secret, 
            session_id: session.id,
            customer_id 
        };
    } catch (error) {
        console.error('Error creating subscription checkout session:', error);
        throw new Error(`Failed to create checkout session: ${error.message}`);
    }
}

// Deprecated function - use createSubscriptionCheckoutSession instead
export async function monthlyPayment(data: { amount: number; price_id: string; customer_id: string; success_url?: string }) {
    console.warn('monthlyPayment is deprecated. Use createSubscriptionCheckoutSession instead.');
    return createSubscriptionCheckoutSession(data);
}

export async function getSessionDetails(sessionId: string) {
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        return {
            session_id: session.id,
            status: session.status,
            customer_id: session.customer,
            subscription_id: session.subscription,
            payment_status: session.payment_status,
            session,
        };
    } catch (error) {
        console.error('Error retrieving session details:', error);
        throw new Error(`Failed to retrieve session details: ${error.message}`);
    }
}

// Utility Functions
export async function validateCustomer(customer_id: string): Promise<boolean> {
    try {
        await retrieveCustomer(customer_id);
        return true;
    } catch (error) {
        return false;
    }
}

export async function ensureCustomerExists(data: CustomerData): Promise<string> {
    try {
        const result = await createOrRetrieveCustomer(data);
        return result.customer_id;
    } catch (error) {
        console.error('Failed to ensure customer exists:', error);
        throw error;
    }
}

// Helper function to handle Stripe errors consistently
export function handleStripeError(error: any): never {
    console.error('Stripe operation failed:', error);
    
    if (error.type === 'StripeCardError') {
        throw new Error(`Card error: ${error.message}`);
    } else if (error.type === 'StripeRateLimitError') {
        throw new Error('Rate limit exceeded. Please try again later.');
    } else if (error.type === 'StripeInvalidRequestError') {
        throw new Error(`Invalid request: ${error.message}`);
    } else if (error.type === 'StripeAPIError') {
        throw new Error('Stripe API error. Please try again later.');
    } else if (error.type === 'StripeConnectionError') {
        throw new Error('Network error. Please check your connection.');
    } else if (error.type === 'StripeAuthenticationError') {
        throw new Error('Authentication error. Please contact support.');
    } else {
        throw new Error(`Stripe error: ${error.message || 'Unknown error occurred'}`);
    }
}
