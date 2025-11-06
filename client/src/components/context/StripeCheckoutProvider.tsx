import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function StripeCheckoutProvider({
  children,
  amount=100,
}: {
  children: React.ReactNode;
  amount: number;
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
   
        
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/student/initiatepayment`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount }),
          }
        );

        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.log("Payment Intent Error:", err);
      }
    };

    createPaymentIntent();
  }, [amount]);

  if (!clientSecret) return <p className="text-center">Loading payment...</p>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      {children}
    </Elements>
  );
}
