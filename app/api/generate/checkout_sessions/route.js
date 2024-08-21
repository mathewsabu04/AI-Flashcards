import { NextResponse } from "next/server"
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const formatAmountForStripe = (amount, currency) => {
  return Math.round(amount * 100)
}

export async function POST(req) {
  const params = {
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Pro Subscription',
          },
          unit_amount: formatAmountForStripe(10, 'usd'),
          recurring: {
            interval: 'month',
            interval_count: 1,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
  };


    const session = await stripe.checkout.sessions.create(params);
    return NextResponse.json(session,{
        status: 200
    });
 
    
  
}