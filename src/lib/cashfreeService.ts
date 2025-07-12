// Cashfree Payment Gateway Service
// Implements the Cashfree Checkout SDK integration as per the official documentation

/// <reference types="vite/client" />

declare global {
  interface Window {
    Cashfree: (config: { mode: string }) => {
      checkout: (options: CheckoutOptions) => Promise<void>;
    };
  }
}

export interface CheckoutOptions {
  paymentSessionId: string;
  returnUrl?: string;
  redirectTarget?: '_blank' | '_self' | '_parent' | '_top' | string;
}

export interface CustomerDetails {
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
}

export interface OrderMeta {
  return_url?: string;
  notify_url?: string;
}

export interface CreateOrderRequest {
  order_id: string;
  order_amount: number;
  order_currency: string;
  customer_details: CustomerDetails;
  order_meta?: OrderMeta;
  order_note?: string;
  order_tags?: Record<string, string>;
}

export interface CreateOrderResponse {
  cf_order_id: number;
  created_at: string;
  customer_details: CustomerDetails;
  entity: string;
  order_amount: number;
  order_currency: string;
  order_expiry_time: string;
  order_id: string;
  order_meta: OrderMeta;
  order_note: string;
  order_status: string;
  order_tags: Record<string, string>;
  payment_session_id: string;
}

export interface OrderStatusResponse {
  cf_order_id: number;
  order_id: string;
  entity: string;
  order_currency: string;
  order_amount: number;
  order_status: 'ACTIVE' | 'PAID' | 'EXPIRED' | 'CANCELLED';
  payment_link: string;
  customer_details: CustomerDetails;
  order_meta: OrderMeta;
  settlements: any;
  payments?: Array<{
    cf_payment_id: number;
    payment_status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'USER_DROPPED';
    payment_amount: number;
    payment_currency: string;
    payment_message: string;
    payment_time: string;
    bank_reference: string;
    auth_id: string;
    payment_method: any;
    payment_group: string;
  }>;
}

class CashfreeService {
  private appId: string;
  private secretKey: string;
  private environment: 'sandbox' | 'production';
  private baseUrl: string;
  private cashfree: any;

  constructor() {
    this.appId = import.meta.env.VITE_CASHFREE_APP_ID;
    this.secretKey = import.meta.env.VITE_CASHFREE_SECRET_KEY;
    this.environment = (import.meta.env.VITE_CASHFREE_ENVIRONMENT as 'sandbox' | 'production') || 'production';
    
    // Set base URL based on environment
    this.baseUrl = this.environment === 'production' 
      ? 'https://api.cashfree.com/pg' 
      : 'https://sandbox.cashfree.com/pg';

    if (!this.appId || !this.secretKey) {
      throw new Error('Cashfree API credentials are not configured. Please check your environment variables.');
    }

    // Initialize Cashfree SDK
    this.initializeSDK();
  }

  private initializeSDK() {
    // Initialize Cashfree SDK as per the documentation
    if (typeof window !== 'undefined' && window.Cashfree) {
      this.cashfree = window.Cashfree({
        mode: this.environment // 'sandbox' or 'production'
      });
      console.log(`Cashfree SDK initialized in ${this.environment} mode`);
    } else {
      console.warn('Cashfree SDK not loaded. Make sure the script is included in your HTML.');
    }
  }

  // Generate unique order ID
  generateOrderId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORDER_${timestamp}_${random}`;
  }

  // Create order using backend API to avoid CORS
  async createOrder(orderData: {
    amount: number;
    currency?: string;
    customerDetails: CustomerDetails;
    orderNote?: string;
    returnUrl?: string;
    notifyUrl?: string;
  }): Promise<CreateOrderResponse> {
    try {
      // Call your backend endpoint instead of Cashfree API directly
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
      const response = await fetch(`${backendUrl}/api/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          order_amount: orderData.amount,
          customer_id: orderData.customerDetails.customer_id,
          customer_name: orderData.customerDetails.customer_name,
          customer_email: orderData.customerDetails.customer_email,
          customer_phone: orderData.customerDetails.customer_phone,
          return_url: orderData.returnUrl || `${window.location.origin}/payment/success`
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Backend API Error:", errorData);
        throw new Error(`Order creation failed: ${response.statusText} - ${errorData.message || "Unknown error"}`);
      }

      const orderResponse: CreateOrderResponse = await response.json();
      console.log("Order created successfully via backend:", orderResponse);
      return orderResponse;
    } catch (error) {
      console.error("Error creating order via backend:", error);
      throw error;
    }
  }

  // Redirect flow - Opens checkout in new tab
  async redirectToPayment(paymentSessionId: string, returnUrl?: string): Promise<void> {
    try {
      if (!this.cashfree) {
        this.initializeSDK();
      }

      const checkoutOptions: CheckoutOptions = {
        paymentSessionId,
        returnUrl: returnUrl || `${window.location.origin}/payment/success`,
        redirectTarget: '_blank' // Opens in new tab
      };

      console.log('Initiating payment with options:', checkoutOptions);

      if (this.cashfree && this.cashfree.checkout) {
        await this.cashfree.checkout(checkoutOptions);
      } else {
        throw new Error('Cashfree SDK not loaded properly. Please refresh the page and try again.');
      }
    } catch (error) {
      console.error('Error redirecting to payment:', error);
      throw error;
    }
  }

  // iFrame flow - Opens checkout in iframe
  async renderPaymentInFrame(paymentSessionId: string, frameName: string, returnUrl?: string): Promise<void> {
    try {
      if (!this.cashfree) {
        this.initializeSDK();
      }

      const checkoutOptions: CheckoutOptions = {
        paymentSessionId,
        returnUrl: returnUrl || `${window.location.origin}/payment/success`,
        redirectTarget: frameName // Name of the iframe
      };

      console.log('Rendering payment in iframe with options:', checkoutOptions);

      if (this.cashfree && this.cashfree.checkout) {
        await this.cashfree.checkout(checkoutOptions);
      } else {
        throw new Error('Cashfree SDK not loaded properly. Please refresh the page and try again.');
      }
    } catch (error) {
      console.error('Error rendering payment in frame:', error);
      throw error;
    }
  }

  // Get order status
  async getOrderStatus(orderId: string): Promise<OrderStatusResponse> {
    try {
      console.log('Fetching order status for:', orderId);

      const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'x-api-version': '2023-08-01',
          'x-client-id': this.appId,
          'x-client-secret': this.secretKey
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to fetch order status: ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      const orderStatus: OrderStatusResponse = await response.json();
      console.log('Order status fetched:', orderStatus);
      
      return orderStatus;
    } catch (error) {
      console.error('Error fetching order status:', error);
      throw error;
    }
  }

  // Verify payment on return URL
  async verifyPayment(orderId: string): Promise<boolean> {
    try {
      const orderStatus = await this.getOrderStatus(orderId);
      
      // Check if order is paid
      const isPaid = orderStatus.order_status === 'PAID';
      
      // Additional check for payment status if payments array exists
      if (orderStatus.payments && orderStatus.payments.length > 0) {
        const latestPayment = orderStatus.payments[orderStatus.payments.length - 1];
        return isPaid && latestPayment.payment_status === 'SUCCESS';
      }
      
      return isPaid;
    } catch (error) {
      console.error('Error verifying payment:', error);
      return false;
    }
  }
}

// Export singleton instance
export const cashfree = new CashfreeService();
