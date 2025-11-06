import {CheckoutProvider} from '@stripe/react-stripe-js/checkout';
import {loadStripe} from '@stripe/stripe-js';
import { useMemo } from 'react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function StripeCheckoutProvider({children,amount}:{children:React.ReactNode,amount:number}) {
  const promise = useMemo(() => {
    return fetch(`${import.meta.env.VITE_SERVER_URL}/initiatepayment`, {
      method: 'GET',
      body: JSON.stringify({amount}),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  return (
    <CheckoutProvider stripe={stripePromise} options={{clientSecret: promise}}>
      {children}
    </CheckoutProvider>
  );
}