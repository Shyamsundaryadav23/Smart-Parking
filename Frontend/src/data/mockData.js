export const parkingLots = [
  { id: "lot-1", name: "City Mall Parking", location: "Downtown", city: "Mumbai", totalSlots: 20, availableSlots: 12 },
  { id: "lot-2", name: "Airport Parking Zone A", location: "Airport Road", city: "Delhi", totalSlots: 50, availableSlots: 23 },
  { id: "lot-3", name: "Central Station Parking", location: "Station Square", city: "Bangalore", totalSlots: 30, availableSlots: 8 },
  { id: "lot-4", name: "Tech Park Garage", location: "IT District", city: "Chennai", totalSlots: 40, availableSlots: 15 },
  { id: "lot-5", name: "Hospital Parking", location: "Medical Avenue", city: "Hyderabad", totalSlots: 25, availableSlots: 5 },
  { id: "lot-6", name: "University Campus Lot", location: "Education Lane", city: "Pune", totalSlots: 35, availableSlots: 18 },
];

export const generateSlots = (lotId, count) => {
  const statuses = ["available", "occupied", "reserved"];
  return Array.from({ length: count }, (_, i) => ({
    id: `${lotId}-slot-${i + 1}`,
    lotId,
    label: `S${i + 1}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }));
};

export const reservations = [
  {
    id: "RES-001",
    userId: "u1",
    userName: "John Doe",
    slotId: "lot-1-slot-3",
    slotLabel: "S3",
    lotName: "City Mall",
    startTime: "2026-03-08 09:00",
    endTime: "2026-03-08 11:00",
    status: "active",
  },
  {
    id: "RES-002",
    userId: "u1",
    userName: "John Doe",
    slotId: "lot-2-slot-7",
    slotLabel: "S7",
    lotName: "Airport Zone A",
    startTime: "2026-03-07 14:00",
    endTime: "2026-03-07 18:00",
    status: "completed",
  },
  {
    id: "RES-003",
    userId: "u2",
    userName: "Jane Smith",
    slotId: "lot-1-slot-5",
    slotLabel: "S5",
    lotName: "City Mall",
    startTime: "2026-03-08 10:00",
    endTime: "2026-03-08 12:00",
    status: "active",
  },
  {
    id: "RES-004",
    userId: "u3",
    userName: "Bob Wilson",
    slotId: "lot-3-slot-2",
    slotLabel: "S2",
    lotName: "Central Station",
    startTime: "2026-03-08 08:00",
    endTime: "2026-03-08 10:00",
    status: "cancelled",
  },
];

export const users = [
  { id: "u1", name: "John Doe", email: "john@example.com", phone: "+1 234 567 890" },
  { id: "u2", name: "Jane Smith", email: "jane@example.com", phone: "+1 234 567 891" },
  { id: "u3", name: "Bob Wilson", email: "bob@example.com", phone: "+1 234 567 892" },
  { id: "u4", name: "Alice Brown", email: "alice@example.com", phone: "+1 234 567 893" },
  { id: "u5", name: "Charlie Davis", email: "charlie@example.com", phone: "+1 234 567 894" },
];