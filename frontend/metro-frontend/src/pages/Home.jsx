import MetroMap from './Map';
import React, { useEffect, useState } from 'react';
import PolarPayment from '../components/payment';
import { TicketView } from '@/components/ticket-view';
const baseUrl=import.meta.env.VITE_BACKEND_URL

const Home = () => {
  const [metroData, setMetroData] = useState(null);
  const [purchasedTicket, setPurchasedTicket] = useState(null);
  const [loadingTicket, setLoadingTicket] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const checkoutId = searchParams.get('checkout_id');

    if (checkoutId) {
      fetchTicketStatus(checkoutId);
    }

    // Fetch Metro Graph Data
    fetch(`${baseUrl}/graph/distances`, {
      method: 'GET',
      credentials: 'include'
    })
      .then(res => res.status === 401 ? window.location.href = "/login" : res.json())
      .then(data => data && setMetroData(data));
  }, []);

  const fetchTicketStatus = async (checkoutId, attempt = 1) => {
  const MAX_ATTEMPTS = 10;
  const DELAY = Math.min(attempt * 1000, 10000);

  if (attempt > MAX_ATTEMPTS) {
    setLoadingTicket(false);
    alert("Payment taking longer than usual. Please check your email or history.");
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/payments/status/${checkoutId}`,{
      method: 'GET',
      credentials: 'include'
    });
    const data = await response.json();

    if (data.status === 'completed') {
      setPurchasedTicket(data.tickets[0]);
      setLoadingTicket(false);
    } else {
      // Retry with incremented attempt count
      setTimeout(() => fetchTicketStatus(checkoutId, attempt + 1), DELAY);
    }
  } catch (error) {
    console.error("Polling error:", error);
    // Even on error, try again until limit
    setTimeout(() => fetchTicketStatus(checkoutId, attempt + 1), DELAY);
  }
};

  const handleBack = () => {
    setPurchasedTicket(null);
    // Clear URL params without reloading page
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  if (!metroData) return <div className="flex min-h-screen items-center justify-center">Loading the vibes...</div>;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex-1 bg-muted/20 flex items-center justify-center p-6 border-r">
         <MetroMap data={metroData} />
      </div>
      <div className="w-full max-w-md flex flex-col justify-center p-6 bg-background">
        {loadingTicket ? (
          <div className="text-center">
            <p className="animate-pulse">Verifying your payment...</p>
            <p className="text-sm text-muted-foreground">This usually takes a few seconds.</p>
          </div>
        ) : purchasedTicket ? (
          <TicketView ticket={purchasedTicket} onBack={handleBack} />
        ) : (
          <PolarPayment 
            stations={metroData.stations} 
            distanceMatrix={metroData.distanceMatrix} 
          />
        )}
      </div>
    </div>
  );
};

export default Home;