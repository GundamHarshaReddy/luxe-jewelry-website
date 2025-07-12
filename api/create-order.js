// API endpoint to create Cashfree payment session
// This handles the server-side order creation with Cashfree

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      amount,
      currency = 'INR',
      customerDetails,
      orderNote,
      items
    } = req.body;

    // Validate required fields
    if (!amount || !customerDetails || !customerDetails.customer_name || !customerDetails.customer_email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Cashfree API configuration
    const CASHFREE_APP_ID = process.env.VITE_CASHFREE_APP_ID;
    const CASHFREE_SECRET_KEY = process.env.VITE_CASHFREE_SECRET_KEY;
    const CASHFREE_ENVIRONMENT = process.env.VITE_CASHFREE_ENVIRONMENT || 'production';

    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      return res.status(500).json({ error: 'Cashfree credentials not configured' });
    }

    // Generate unique order ID
    const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Determine API base URL
    const baseUrl = CASHFREE_ENVIRONMENT === 'production' 
      ? 'https://api.cashfree.com/pg' 
      : 'https://sandbox.cashfree.com/pg';

    // Prepare order data for Cashfree
    const orderData = {
      order_id: orderId,
      order_amount: amount,
      order_currency: currency,
      customer_details: {
        customer_id: customerDetails.customer_id || `CUST_${Date.now()}`,
        customer_name: customerDetails.customer_name,
        customer_email: customerDetails.customer_email,
        customer_phone: customerDetails.customer_phone
      },
      order_meta: {
        return_url: `${req.headers.origin || 'http://localhost:3000'}/payment/success?order_id=${orderId}`,
        notify_url: `${req.headers.origin || 'http://localhost:3000'}/api/webhook`
      },
      order_note: orderNote || 'Luxe & Lush Jewelry Purchase',
      order_tags: {
        source: 'website',
        platform: 'web',
        items: items ? JSON.stringify(items) : 'unknown'
      }
    };

    console.log('Creating Cashfree order:', orderData);

    // Create order with Cashfree
    const response = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Cashfree API Error:', errorData);
      throw new Error(`Order creation failed: ${response.statusText} - ${errorData.message || 'Unknown error'}`);
    }

    const orderResponse = await response.json();
    console.log('Cashfree order created:', orderResponse);

    // Return the payment session data
    res.status(200).json({
      success: true,
      order_id: orderResponse.order_id,
      payment_session_id: orderResponse.payment_session_id,
      order_status: orderResponse.order_status,
      order_amount: orderResponse.order_amount,
      order_currency: orderResponse.order_currency
    });

  } catch (error) {
    console.error('Error creating payment session:', error);
    res.status(500).json({ 
      error: 'Failed to create payment session',
      message: error.message 
    });
  }
}
