import { useState, useEffect } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "sonner";

const CheckoutForm = ({ enrollmentId,handleconfirmPayment }: { enrollmentId: string,handleconfirmPayment:(item:number)=>void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage("Stripe.js has not loaded yet.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const res= await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      }
      ,
      redirect:"if_required",
    });
    const error = res.error;
   
    setIsProcessing(false);

    if (error) {
      setErrorMessage(error.message || "Something went wrong.");
    } else {
       handleconfirmPayment(Number(enrollmentId));
      
      toast("Payment successful! 🎉");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto overflow-x-hidden">
      <PaymentElement />
      {errorMessage && (
        <div className="text-red-500">{errorMessage}</div>
      )}
      <button
        type="submit"
        disabled={isProcessing}
        className="w-full py-2 bg-blue-500 text-white rounded-md"
      >
        {isProcessing ? "Processing..." : "Submit Payment"}
      </button>
    </form>
  );
};

export default CheckoutForm;
