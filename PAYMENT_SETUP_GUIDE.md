# Cashfree Payment Integration Setup Guide

This guide explains how to set up the Cashfree payment integration for your jewelry website.

## Prerequisites

1. Cashfree Merchant Account
2. API Credentials (App ID and Secret Key)
3. Environment Variables configured

## Setup Steps

### 1. Get Cashfree API Credentials

1. Login to your Cashfree merchant dashboard
2. Navigate to **Developers** > **API Keys**
3. For Production: Use production credentials
4. For Testing: Switch to Test environment and use sandbox credentials

### 2. Configure Environment Variables

Create a `.env` file in your project root:

```env
# Cashfree Payment Gateway Configuration
VITE_CASHFREE_APP_ID=your_cashfree_app_id_here
VITE_CASHFREE_SECRET_KEY=your_cashfree_secret_key_here
VITE_CASHFREE_ENVIRONMENT=production

# For testing, use:
# VITE_CASHFREE_ENVIRONMENT=sandbox

# Other configurations...
```

### 3. Webhook Configuration

1. Go to Cashfree Dashboard > **Developers** > **Webhooks**
2. Click **Add Webhook**
3. Add your webhook URL: `https://yourdomain.com/api/webhook`
4. Select API version: `2023-08-01`
5. Select events:
   - Payment Success Webhook
   - Payment Failed Webhook
   - Payment User Dropped Webhook

### 4. Testing the Integration

#### For Sandbox Testing:
1. Set `VITE_CASHFREE_ENVIRONMENT=sandbox`
2. Use sandbox API credentials
3. Use test card details provided by Cashfree

#### For Production:
1. Set `VITE_CASHFREE_ENVIRONMENT=production`
2. Use production API credentials
3. Real payments will be processed

## How the Payment Flow Works

### 1. Order Creation
- Customer fills cart and provides details
- Frontend calls `cashfreeService.createOrder()`
- Creates order with Cashfree API
- Returns `payment_session_id`

### 2. Payment Processing
- Uses Cashfree SDK to open payment interface
- Supports two flows:
  - **Redirect Flow**: Opens in new tab (`redirectToPayment()`)
  - **iFrame Flow**: Embedded checkout (`renderPaymentInFrame()`)

### 3. Payment Completion
- Customer completes payment
- Cashfree redirects to success/failure page
- Frontend verifies payment status
- Webhook notifies backend of payment status

## API Endpoints

### Frontend Service (`cashfreeService.ts`)
- `createOrder()` - Create new payment order
- `redirectToPayment()` - Redirect to payment page
- `renderPaymentInFrame()` - Embed payment in iframe
- `getOrderStatus()` - Check order status
- `verifyPayment()` - Verify payment completion

### Backend APIs
- `/api/create-order` - Server-side order creation
- `/api/webhook` - Handle payment notifications

## Payment Methods Supported

- Credit/Debit Cards
- UPI
- Net Banking
- Digital Wallets
- EMI options
- International cards (if enabled)

## Security Features

- SSL encryption for all communications
- Webhook signature verification
- Environment-based configuration
- No sensitive data stored in frontend
- PCI DSS compliant (through Cashfree)

## Troubleshooting

### Common Issues:

1. **SDK not loading**
   - Check if Cashfree script is included in HTML
   - Verify internet connection
   - Check browser console for errors

2. **Order creation fails**
   - Verify API credentials
   - Check environment configuration
   - Validate request parameters

3. **Payment redirect fails**
   - Ensure `payment_session_id` is valid
   - Check return URL configuration
   - Verify SDK initialization

4. **Webhook not receiving events**
   - Check webhook URL is accessible
   - Verify SSL certificate
   - Check webhook configuration in dashboard

### Debug Mode:
Enable console logging by opening browser developer tools. The service logs all API calls and responses.

## Production Checklist

- [ ] Production API credentials configured
- [ ] Webhook URL is live and SSL enabled
- [ ] Return URLs are production domains
- [ ] Error handling is implemented
- [ ] Order confirmation emails setup
- [ ] Customer support contact is available
- [ ] Payment testing completed
- [ ] Terms of service and privacy policy linked

## Support

For technical issues:
- Check Cashfree documentation: https://docs.cashfree.com/
- Contact Cashfree support
- Review webhook logs in dashboard
- Check browser console for client-side errors
