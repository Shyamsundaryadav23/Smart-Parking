import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MapPin, Car, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parkingLots } from "@/data/mockData";

const CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune",
];

const UserDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const filteredLots = useMemo(() => {
    return parkingLots.filter((lot) => {
      const matchesQuery =
        searchQuery === "" ||
        lot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lot.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lot.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity =
        selectedCity === "" || lot.city === selectedCity;
      return matchesQuery && matchesCity;
    });
  }, [searchQuery, selectedCity]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Parking Locations</h1>
        <p className="text-muted-foreground mt-1">
          Find and book available parking slots near you
        </p>
      </div>

      {/* Search and filter controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Search Input */}
        <div className="relative w-full sm:w-1/2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            🔍
          </span>
          <input
            type="text"
            className="input w-full pl-10 pr-4 py-3 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="Search by name, city, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* City Dropdown */}
        <div className="relative w-full sm:w-1/4">
          <select
            className="select w-full py-3 px-4 rounded-lg shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition bg-white appearance-none"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">All Cities</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Dropdown arrow icon */}
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            ▼
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLots.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground">
            No parking locations found.
          </div>
        ) : (
          filteredLots.map((lot) => (
            <div key={lot.id} className="parking-card overflow-hidden">
              <div className="hero-bg p-5">
                <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
                  <MapPin className="h-4 w-4" />
                  {lot.city || lot.location}
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
          ))
        )}
      </div>
    </div>
  );
};

export default UserDashboard;