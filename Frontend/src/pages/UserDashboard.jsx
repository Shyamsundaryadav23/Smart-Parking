import { Link } from "react-router-dom";
import { MapPin, Car, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parkingLots } from "@/data/mockData";

const UserDashboard = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Parking Locations</h1>
        <p className="text-muted-foreground mt-1">
          Find and book available parking slots near you
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {parkingLots.map((lot) => (
          <div key={lot.id} className="parking-card overflow-hidden">
            <div className="hero-bg p-5">
              <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
                <MapPin className="h-4 w-4" />
                {lot.location}
              </div>

              <h3 className="text-lg font-semibold text-primary-foreground mt-1">
                {lot.name}
              </h3>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {lot.totalSlots} Total Slots
                  </span>
                </div>

                <span
                  className={`text-sm font-semibold px-2.5 py-1 rounded-full ${
                    lot.availableSlots > 10
                      ? "bg-success/15 text-success"
                      : lot.availableSlots > 3
                      ? "bg-warning/15 text-warning"
                      : "bg-destructive/15 text-destructive"
                  }`}
                >
                  {lot.availableSlots} Available
                </span>
              </div>

              <Link to={`/slots/${lot.id}`}>
                <Button className="w-full gradient-bg text-primary-foreground hover:opacity-90">
                  View Slots <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;