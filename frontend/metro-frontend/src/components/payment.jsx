import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
} from "@/components/ui/field";
const baseUrl=import.meta.env.VITE_BACKEND_URL
const PolarPayment = ({ stations, distanceMatrix }) => {
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [price, setPrice] = useState(null);
  const [distance,setDistance]= useState(null);

  if (!stations || Object.keys(stations).length === 0 || !distanceMatrix) {
    return <div className="p-6 text-center">Loading stations data...</div>;
  }

  useEffect(() => {
    if (source && destination && source !== destination) {
       const dist = distanceMatrix[source]?.[destination];
       if (dist !== undefined) {
         setPrice(Math.round(dist * 2));
         setDistance(dist);
       } else {
         setPrice(null);
       }
    } else {
      setPrice(null); 
    }
  }, [source, destination, distanceMatrix]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!price) return;

    setLoading(true);

    // Save ticket details to session storage to retrieve after redirect
    sessionStorage.setItem('last_ticket', JSON.stringify({
      source: stations[source],
      destination: stations[destination],
      price
    }));

    try {
      const response = await fetch(`${baseUrl}/payments/create-session`, {
        method: 'POST',
      credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: price, 
          sourceId: source,
          destId: destination
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Polar's hosted sandbox checkout
        window.location.href = data.url;
      } else {
        alert("Failed to create checkout session");
      }
    } catch (err) {
      console.error("Payment Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 rounded-lg border bg-card text-card-foreground shadow-sm max-w-md w-full mx-auto mt-8">
      <div className="text-center">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Genz Metro Edition
          </span>
        </h1>
        <div className="h-1 w-12 bg-foreground mx-auto mt-2 rounded-full" />
      </div>
      <div className="flex flex-col space-y-1.5">
        <h3 className="font-semibold tracking-tight text-2xl">Book Your Ticket</h3>
        <p className="text-sm text-muted-foreground">Select your journey details.</p>
      </div>
      
      <div className="grid gap-4">
        <Field className="grid gap-2">
          <FieldLabel htmlFor="source">Source Station</FieldLabel>
          <select
            id="source"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            <option value="" disabled>Select Source</option>
            {Object.entries(stations || {}).map(([id, name]) => (
              <option key={id} value={id} disabled={id === destination}>
                {name}
              </option>
            ))}
          </select>
        </Field>
        
        <Field className="grid gap-2">
          <FieldLabel htmlFor="destination">Destination Station</FieldLabel>
           <select
            id="destination"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          >
            <option value="" disabled>Select Destination</option>
            {Object.entries(stations || {}).map(([id, name]) => (
               <option key={id} value={id} disabled={id === source}>
                {name}
              </option>
            ))}
          </select>
        </Field>

        {/* --- PRICE & INFO BANNER SECTION --- */}
        {price !== null && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 bg-muted rounded-md">
              <span className="text-sm font-medium">Total Price:</span>
              <span className="text-xl font-bold">${price}</span>
            </div>
            
            {/* Info Banner */}
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50/50 border border-blue-100 rounded-md text-[11px] text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
              </svg>
              <span>
                Pricing structure: <strong>{distance} kms × $2.00</strong>
              </span>
            </div>
          </div>
        )}  

        <Button 
          onClick={handleCheckout} 
          className="w-full" 
          disabled={loading || price === null}
        >
          {loading ? 'Redirecting...' : 'Purchase Ticket'}
        </Button>
      </div>
    </div>
  );
};

export default PolarPayment;