import { useEffect } from 'react';
import { toast } from 'sonner';
import { getSocket } from '@/lib/socket';

/**
 * Hook to handle in-app notifications for reservation and slot events
 */
export const useNotifications = () => {
  // Notify reservation success
  const notifyReservationSuccess = (slotNumber) => {
    toast.success(`Reservation successful! Slot ${slotNumber} has been reserved.`);
  };

  // Notify reservation cancellation
  const notifyReservationCancelled = () => {
    toast.success('Your reservation has been cancelled.');
  };

  // Notify parking expiry warning
  const notifyParkingExpiring = (minutesRemaining) => {
    toast.warning(`Your parking reservation will expire in ${minutesRemaining} minutes!`);
  };

  // Notify slot availability
  const notifySlotAvailable = (slotNumber) => {
    toast.info(`A parking slot (${slotNumber}) is now available!`);
  };

  // Notify slot status change (admin)
  const notifySlotStatusChange = (slotNumber, newStatus) => {
    toast.info(`Slot ${slotNumber} status changed to ${newStatus}`);
  };

  // Setup socket listeners for real-time notifications
  useEffect(() => {
    try {
      const socket = getSocket();

      // Listen for slot status updates
      const handleSlotUpdate = (data) => {
        notifySlotStatusChange(data.slot_id, data.status);
      };

      socket.on('slotStatusUpdated', handleSlotUpdate);

      return () => {
        socket.off('slotStatusUpdated', handleSlotUpdate);
      };
    } catch (err) {
      console.warn('Socket notification listener not available:', err);
    }
  }, []);

  // Check reservation expiry times
  useEffect(() => {
    // This would need to be called from a component that has reservations
    // It's set up here as a helper for the pattern
  }, []);

  return {
    notifyReservationSuccess,
    notifyReservationCancelled,
    notifyParkingExpiring,
    notifySlotAvailable,
    notifySlotStatusChange,
  };
};
