'use client';
import { useState } from 'react';

export default function PaymentButton() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Call your backend route to create an order
      const res = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 500 }), // 500 INR test amount
      });
      const order = await res.json();

      if (!order.id) {
        alert('Error creating order');
        setLoading(false);
        return;
      }

      // 2. Open Razorpay payment popup
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'PocketWise',
        description: 'Pocket Money Deposit',
        order_id: order.id,
        handler: function (response: any) {
          alert(`Success! Payment ID: ${response.razorpay_payment_id}`);
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
      className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
    >
      {loading ? 'Processing...' : 'Add Money via UPI / Card'}
    </button>
  );
}