import { useState, useEffect } from 'react';
import { getSocket } from '@/lib/socket';
import API from '@/lib/api';

/**
 * Custom hook for real-time slot monitoring
 * Fully socket-based, no polling
 */
export const useSlotMonitoring = (lotId) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initial fetch of slots
  const fetchSlots = async () => {
    if (!lotId) return;
    try {
      setLoading(true);
      const res = await API.get(`/slots/live/${lotId}`);
      setSlots(res.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch live slots:', err);
      setError('Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!lotId) return;

    fetchSlots(); // initial load

    // Setup Socket.io
    let socket;
    try {
      socket = getSocket();

      const handleSlotUpdate = (data) => {
        if (data.lot_id === lotId) {
          setSlots((prevSlots) =>
            prevSlots.map((slot) =>
              slot.slot_id === data.slot_id ? { ...slot, status: data.status } : slot
            )
          );
        }
      };

      socket.on('slotStatusUpdated', handleSlotUpdate);

      // Cleanup on unmount
      return () => {
        socket.off('slotStatusUpdated', handleSlotUpdate);
      };
    } catch (err) {
      console.warn('Socket.io not available:', err);
    }
  }, [lotId]);

  // Optimistic update (used in admin slot status change)
  const updateSlotStatus = (slotId, newStatus) => {
    setSlots((prev) =>
      prev.map((slot) => (slot.slot_id === slotId ? { ...slot, status: newStatus } : slot))
    );
  };

  return {
    slots,
    loading,
    error,
    refetch: fetchSlots, // can manually refresh if needed
    updateSlotStatus,
  };
};