import API from './api';

/**
 * Create a Razorpay payment order
 */
export const createPaymentOrder = async (orderData) => {
  try {
    const response = await API.post('/payment/create-order', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating payment order:', error);
    throw error?.response?.data || error;
  }
};

/**
 * Verify payment with backend
 */
export const verifyPayment = async (paymentData) => {
  try {
    const response = await API.post('/payment/verify', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error?.response?.data || error;
  }
};

/**
 * Create reservation (existing API call)
 */
export const createReservation = async (reservationData) => {
  try {
    const response = await API.post('/reservations', reservationData);
    return response.data;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error?.response?.data || error;
  }
};

/**
 * Open Razorpay checkout and handle payment
 * Returns payment details on success
 */
export const openRazorpayCheckout = (orderDetails, userInfo) => {
  return new Promise((resolve, reject) => {
    // Load Razorpay script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => {
      const options = {
        key: orderDetails.key_id,
        amount: orderDetails.amount,
        currency: orderDetails.currency,
        name: 'Smart Parking System',
        description: 'Parking Slot Reservation',
        order_id: orderDetails.orderId,
        handler: (response) => {
          // Payment successful
          resolve({
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });
        },
        prefill: {
          email: userInfo?.email || '',
          contact: userInfo?.phone || '',
          name: userInfo?.name || '',
        },
        theme: {
          color: '#3b82f6', // Blue color
        },
        // Enable UPI and other payment methods
        method: {
          upi: true,        // Enable UPI
          card: true,       // Enable Cards
          wallet: true,     // Enable Wallets
          netbanking: true, // Enable Net Banking
        },
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled by user'));
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    };

    script.onerror = () => {
      reject(new Error('Failed to load Razorpay script'));
    };

    document.body.appendChild(script);
  });
};

/**
 * Complete payment flow: Create order → Pay → Verify → Create Reservation
 */
export const payAndBook = async (slotData, reservationData, userInfo) => {
  try {
    // Step 1: Create payment order
    const orderDetails = await createPaymentOrder({
      slot_id: slotData.slot_id,
      vehicle_type: slotData.vehicle_type,
      start_time: slotData.start_time,
      end_time: slotData.end_time,
    });

    // Step 2: Open Razorpay checkout
    const paymentResult = await openRazorpayCheckout(orderDetails, userInfo);

    // Step 3: Verify payment
    await verifyPayment({
      payment_id: paymentResult.payment_id,
      order_id: paymentResult.order_id,
      signature: paymentResult.signature,
      slot_id: slotData.slot_id,
      vehicle_type: slotData.vehicle_type,
      start_time: slotData.start_time,
      end_time: slotData.end_time,
    });

    // Step 4: Create reservation with payment details
    const reservation = await createReservation({
      ...reservationData,
      payment_id: paymentResult.payment_id,
      payment_status: 'captured',
      amount: orderDetails.amount,
    });

    return {
      success: true,
      reservation,
      paymentResult,
    };
  } catch (error) {
    console.error('Payment and booking failed:', error);
    throw error;
  }
};
