const Razorpay = require('razorpay');

// Initialize Razorpay instance only if credentials are provided
let razorpay = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// Helper function to calculate price
function calculatePrice(vehicleType) {
  switch (vehicleType) {
    case 'car':
      return 50;
    case 'bike':
      return 20;
    case 'electric':
      return 40;
    default:
      return 50;
  }
}

/**
 * Create a Razorpay order
 * Body: { slot_id, vehicle_type, start_time, end_time }
 */
async function createOrder(req, res) {
  try {
    // Check if Razorpay is configured
    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message: 'Payment service is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env',
      });
    }

    const { slot_id, vehicle_type, start_time, end_time } = req.body;
    const user_id = req.user.user_id;

    if (!slot_id || !vehicle_type || !start_time || !end_time) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Calculate price based on vehicle type
    const price = calculatePrice(vehicle_type);
    const amount = price * 100; // Razorpay expects amount in paise

    // Create Razorpay order
    // Receipt must be max 40 characters
    const receipt = `PKG_${Date.now().toString().slice(-10)}`;
    
    const orderOptions = {
      amount: amount,
      currency: 'INR',
      receipt: receipt,
      notes: {
        user_id: user_id,
        slot_id: slot_id,
        vehicle_type: vehicle_type,
        start_time: start_time,
        end_time: end_time,
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    res.status(201).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: err.message,
    });
  }
}

/**
 * Verify payment and create reservation metadata
 * Body: { payment_id, slot_id, vehicle_type, vehicle_number, start_time, end_time }
 */
async function verifyPayment(req, res) {
  try {
    const { payment_id, order_id, signature, slot_id, vehicle_type, vehicle_number, start_time, end_time } = req.body;

    if (!payment_id || !order_id || !signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification details',
      });
    }

    // Verify signature (basic implementation)
    // In production, use proper HMAC-SHA256 verification
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${order_id}|${payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }

    // Return success - actual reservation creation happens in the reservation API
    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      payment_id: payment_id,
      order_id: order_id,
    });
  } catch (err) {
    console.error('Error verifying payment:', err);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: err.message,
    });
  }
}

module.exports = {
  createOrder,
  verifyPayment,
};
