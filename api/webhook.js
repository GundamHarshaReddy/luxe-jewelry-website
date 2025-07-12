// Webhook handler for Cashfree payment notifications
// This should be deployed as a serverless function or API endpoint

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhookData = req.body;
    
    console.log('Received webhook from Cashfree:', webhookData);

    // Verify webhook signature (recommended for production)
    // const signature = req.headers['x-webhook-signature'];
    // if (!verifyWebhookSignature(req.body, signature)) {
    //   return res.status(401).json({ error: 'Invalid signature' });
    // }

    // Extract payment information
    const {
      type,
      data: {
        order = {},
        payment = {}
      } = {}
    } = webhookData;

    // Handle different webhook types
    switch (type) {
      case 'PAYMENT_SUCCESS_WEBHOOK':
        await handlePaymentSuccess(order, payment);
        break;
      
      case 'PAYMENT_FAILED_WEBHOOK':
        await handlePaymentFailure(order, payment);
        break;
      
      case 'PAYMENT_USER_DROPPED_WEBHOOK':
        await handlePaymentDropped(order, payment);
        break;
      
      default:
        console.log('Unhandled webhook type:', type);
    }

    // Always respond with 200 to acknowledge receipt
    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handlePaymentSuccess(order, payment) {
  console.log('Payment successful:', {
    orderId: order.order_id,
    amount: order.order_amount,
    paymentId: payment.cf_payment_id
  });

  // TODO: Implement your business logic here:
  // 1. Update order status in database
  // 2. Send confirmation email to customer
  // 3. Update inventory
  // 4. Trigger fulfillment process
  // 5. Send notification to admin

  // Example database update (replace with your actual database logic)
  // await updateOrderStatus(order.order_id, 'PAID', payment);
  
  // Example email notification (replace with your email service)
  // await sendOrderConfirmationEmail(order.customer_details.customer_email, order);
}

async function handlePaymentFailure(order, payment) {
  console.log('Payment failed:', {
    orderId: order.order_id,
    amount: order.order_amount,
    reason: payment.payment_message
  });

  // TODO: Implement your business logic here:
  // 1. Update order status in database
  // 2. Send payment failure notification
  // 3. Optionally, send retry payment link

  // Example database update
  // await updateOrderStatus(order.order_id, 'FAILED', payment);
}

async function handlePaymentDropped(order, payment) {
  console.log('Payment dropped by user:', {
    orderId: order.order_id,
    amount: order.order_amount
  });

  // TODO: Implement your business logic here:
  // 1. Update order status in database
  // 2. Optionally, send cart abandonment email

  // Example database update
  // await updateOrderStatus(order.order_id, 'ABANDONED', payment);
}

// Helper function to verify webhook signature (recommended for production)
function verifyWebhookSignature(payload, signature) {
  // Implementation depends on Cashfree's signature verification method
  // Check Cashfree documentation for exact implementation
  
  // Example implementation:
  // const crypto = require('crypto');
  // const webhookSecret = process.env.CASHFREE_WEBHOOK_SECRET;
  // const expectedSignature = crypto
  //   .createHmac('sha256', webhookSecret)
  //   .update(JSON.stringify(payload))
  //   .digest('hex');
  // 
  // return signature === expectedSignature;
  
  return true; // For demo purposes
}
