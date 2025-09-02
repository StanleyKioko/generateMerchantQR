# Merchant QR Code Generator

A payment solution that generates QR codes for merchants to accept payments via M-Pesa.

## Overview

This system allows merchants to generate QR codes that customers can scan to make payments. The QR codes can be configured to accept either fixed or dynamic payment amounts.

## How It Works

The system consists of several components:

1. **QR Code Generation**: Merchants can generate QR codes with custom descriptions, references, and payment types.
2. **M-Pesa Integration**: The system integrates with M-Pesa's API for payment processing.
3. **Transaction Management**: All transactions are tracked and stored in the database.

## Core Features

- Generate merchant-specific QR codes
- Support for both fixed and dynamic payment amounts
- M-Pesa STK Push integration
- Transaction tracking and callback handling

## API Endpoints

### Generate Merchant QR Code

```
POST /generateMerchantQR
```

**Request Body:**
```json
{
  "description": "Payment for services",
  "reference": "INV12345",
  "businessName": "My Store",
  "dynamicAmount": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "QR Code generated successfully",
  "data": {
    "qrUrl": "http://example.com/pay?merchantId=...",
    "merchantId": "user123",
    "businessName": "My Store",
    "dynamicAmount": true
  }
}
```

### Other Endpoints

- `triggerSTKPush`: Initiates M-Pesa STK push to customer's phone
- `handleCallback`: Processes M-Pesa callback data
- `createTransaction`: Records transaction details
- `healthCheck`: Verifies system functionality

## Implementation Details

The QR generation process:

1. Authenticates the merchant user
2. Retrieves merchant information from the database
3. Creates a QR code containing payment details
4. Returns a URL that the frontend can convert to a scannable QR code

When a customer scans the QR code:
1. They are directed to a payment page
2. They enter payment amount (if dynamic)
3. The system triggers an STK push to their phone
4. The transaction is processed and recorded

## Dependencies

- Firebase (Firestore for database, Auth for authentication)
- M-Pesa API integration
- Node.js backend

## Environment Variables

The system requires the following environment variables:

- `MPESA_SHORTCODE`: The M-Pesa shortcode for the business
- `FRONTEND_URL`: Base URL for the frontend application

## Getting Started

1. Set up environment variables
2. Deploy the backend API
3. Implement the frontend scanning component
4. Test the payment flow

## Security Considerations

- All merchant authentication is handled through Firebase Auth
- Sensitive payment details are never exposed in the QR code
- Transaction validation happens on the server side
