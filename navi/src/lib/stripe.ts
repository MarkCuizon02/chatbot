import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function oneTimePayment(data: any) {
    try {
        let customer_id = data.customer_id;
        if (customer_id) {
        const customer = await retrieveCustomer(customer_id);
        if (customer && !(customer as any).error_message) {
            customer_id = (customer as any).id;
        } else {
            return { error_message: (customer as any).error_message || 'Failed to retrieve customer.' };
        }
        }

        const intent = await stripe.paymentIntents.create({
            customer: customer_id,
            amount: data.amount * 100,
            currency: 'usd',
            description: data.ddecation !== "" ? data.ddecation : "Amount",
            automatic_payment_methods: { enabled: true },
        });

        return {
            payment_id: intent.id,
            client_secret: intent.client_secret,
            customer_id: customer_id,
        };
    } catch (e: any) {
        return { error_message: e.message };
    }
}

export async function monthlyPayment(data: any) {
    try {
        const amount = data.amount;
        const price_id = data.price_id;
        const customer_id = data.customer_id;

        if (!customer_id) {
            return { error_message: 'Customer ID required' };
        }

        // Create a Stripe Checkout Session for subscription (embedded)
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: price_id,
                    quantity: amount,
                },
            ],
            customer: customer_id,
            ui_mode: 'embedded',
            return_url: data.success_url || 'http://localhost:3000/subscribe/thank-you?session_id={CHECKOUT_SESSION_ID}',
        });

        return { client_secret: session.client_secret };
    } catch (e: any) {
        return { error_message: e.message };
    }
}

export async function updatePaymentIntent(data: any) {
    try {
        const intent = await stripe.paymentIntents.update(data.payment_id, {
            customer: data.customer_id,
            amount: data.amount * 100,
            currency: 'usd',
            description: data.ddecation !== "" ? data.ddecation : "Amount",
            receipt_email: data.email,
        });

        return {
            payment_id: intent.id,
            client_secret: intent.client_secret,
        };
    } catch (e: any) {
        return { error_message: e.message };
    }
}

async function searchCustomer(email: string) {
    try {
        const customer = await stripe.customers.search({
            query: `email:'${email}'`,
        });
        return customer.data;
    } catch (e: any) {
        return { error_message: e.message };
    }
}

async function retrieveCustomer(customer_id: string) {
    try {
        const customer = await stripe.customers.retrieve(customer_id, { expand: ['subscriptions'] });
        return customer;
    } catch (e: any) {
        return { error_message: e.message };
    }
}

export async function createCustomer(data: any) {
    try {
        const res = await searchCustomer(data.email);
        if (Array.isArray(res) && res.length > 0) {
        return { customer_id: res[0].id };
        }
        const customer = await stripe.customers.create({
        name: `${data.fname} ${data.lname}`,
        email: data.email,
        phone: data.phone,
        });
        return { customer_id: customer.id };
    } catch (e: any) {
        return { error_message: e.message };
    }
}

export async function updateCustomer(data: any) {
    try {
        const customer = await stripe.customers.update(data.customer_id, {
        name: `${data.fname} ${data.lname}`,
        email: data.email,
        phone: data.phone,
        });
        return { customer_id: customer.id };
    } catch (e: any) {
        return { error_message: e.message };
    }
}

export async function unsubscribeBySubId(subscription_id: string) {
    try {
        await stripe.subscriptions.cancel(subscription_id);
        return { success_message: 'Monthly donation is canceled.' };
    } catch (e: any) {
        return { error_message: e.message };
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
        });

        return {
            customer_id: customer_id,
            subscription_id: subscription.id,
        };
    } catch (e: any) {
        console.log("message", e.message);
        return { error_message: e.message };
    }
}

export async function getCustomerSubscription(email: string) {
    try {
        const res = await searchCustomer(email);
        if (Array.isArray(res) && res.length > 0) {
        const customer = await retrieveCustomer(res[0].id);
        const html = generateHtml(customer);
        return { customer_subscriptions: html };
        }
        return { error_message: "Customer not found!" };
    } catch (e: any) {
        return { error_message: e.message };
    }
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
        };
    } catch (e: any) {
        return { error_message: e.message };
    }
}

function generateHtml(customer: any) {
  let html = "";
  if (customer.subscriptions && customer.subscriptions.data) {
    const subscriptions = customer.subscriptions.data;
    const data: any = [];
    let cnt = 0;
    for (const subscription of subscriptions) {
      data[cnt] = {
        subscription_id: subscription.id,
        name: 'Donation',
        start: subscription.current_period_start,
        end: subscription.current_period_end,
        quantity: subscription.items.data[0].quantity / 100,
      };
      cnt++;
    }

    if (data.length > 0) {
      html += '<table class="table table-hover">';
      html += '<thead>';
      html += '<tr>';
      html += '<th scope="col" width="40%">Subscription</th>';
      html += '<th scope="col">Amount</th>';
      html += '<th scope="col">Start</th>';
      html += '<th scope="col">End</th>';
      html += '<th scope="col">Action</th>';
      html += '<tr>';
      html += '</thead>';
      html += '<tbody>';

      for (const value of data) {
        html += '<tr>';
        html += `<td>${value.name}</td>`;
        html += `<td>${value.quantity}</td>`;
        html += `<td>${new Date(value.start * 1000).toISOString().split('T')[0]}</td>`;
        html += `<td>${new Date(value.end * 1000).toISOString().split('T')[0]}</td>`;
        html += '<td>';
        html += `<button type="button" data-subscription="${value.subscription_id}" class="btn btn-primary sub-cancel" data-bs-toggle="modal" data-bs-target="#cancelModal">Cancel</button>`;
        html += '</td>';
        html += '</tr>';
      }

      html += '</tbody>';
      html += '</table>';
    } else {
      html += 'No subscription found!';
    }
  } else {
    html += 'No subscription found!';
  }

  return html;
}
