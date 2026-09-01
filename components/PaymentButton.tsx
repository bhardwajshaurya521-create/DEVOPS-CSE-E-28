'use client';
import { useState } from 'react';

interface PaymentButtonProps {
  amount: number;
  onSuccess?: () => void;
}

export default function PaymentButton({ amount, onSuccess }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    
    // Load the Razorpay script dynamically
    const resScript = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!resScript) {
      alert('Razorpay SDK failed to load. Check your internet connection.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const order = await res.json();

      if (!order.id) {
        alert('Error creating order');
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'PocketWise',
        description: 'Pocket Money Deposit',
        order_id: order.id,
        handler: async function (response: any) {
          alert(`Success! Payment ID: ${response.razorpay_payment_id}`);
          if (onSuccess) onSuccess();
        },
        theme: { color: '#4f46e5' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="btn btn-primary"
    >
      {loading ? 'Processing...' : `Add ₹${amount} via UPI`}
    </button>
  );
}