'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ResultPage() {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      verifyPayment(sessionId);
    } else {
      setStatus('error');
      setError('No session ID found in URL');
    }
  }, [searchParams]);

  async function verifyPayment(sessionId) {
    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      if (response.ok) {
        const data = await response.json();
        setStatus('success');
      } else {
        const errorData = await response.json();
        setStatus('error');
        setError(`Server error: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setStatus('error');
      setError(`Client error: ${error.message}`);
    }
  }

  if (status === 'loading') {
    return <div>Verifying your payment...</div>;
  }

  if (status === 'success') {
    return <div>Payment successful! Your subscription is now active.</div>;
  }

  return (
    <div>
      <p>There was an error processing your payment. Please contact support.</p>
      <p>Error details: {error}</p>
    </div>
  );
}