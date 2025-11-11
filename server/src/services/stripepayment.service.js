import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const paymentIntent = async (amount) =>{
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency:"inr",
        payment_method_types:["card"]    
    });
    console.log(paymentIntent.client_secret);
    
    return paymentIntent;
}