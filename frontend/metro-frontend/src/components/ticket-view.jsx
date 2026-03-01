import { Button } from "@/components/ui/button";
import { GalleryVerticalEnd } from "lucide-react";

export function TicketView({ ticket, onBack }) {
  if (!ticket) return null;

  return (
    <div className="flex flex-col gap-6 p-6 rounded-lg border bg-card text-card-foreground shadow-sm max-w-sm w-full mx-auto mt-8 animate-in fade-in zoom-in duration-300">
      <div className="flex flex-col items-center space-y-4 text-center">
         <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-full">
            <GalleryVerticalEnd className="size-6" />
        </div>
        <h3 className="font-semibold tracking-tight text-2xl text-green-600">Ticket Confirmed</h3>
        <p className="text-sm text-muted-foreground">Your journey is booked!</p>
      </div>
      
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase font-bold">From</span>
                <span className="font-medium text-lg">{ticket.sourceStation.name}</span>
            </div>
             <div className="flex flex-col gap-1 text-right">
                <span className="text-xs text-muted-foreground uppercase font-bold">To</span>
                <span className="font-medium text-lg">{ticket.destinationStation.name}</span>
            </div>
        </div>
         <div className="border-t border-dashed my-2"></div>
         <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Price Paid</span>
            <span className="text-2xl font-bold">${ticket.farePaid}</span>
         </div>
      </div>

      <Button onClick={onBack} variant="outline" className="w-full">
        Book Another Ticket
      </Button>
    </div>
  );
}
