async function generateMerchantQR(req, res) {
  try {
    const merchantId = req.user.uid;
    const { description, reference, businessName, dynamicAmount = true } = req.body;

    // Get merchant info
    let merchantData = null;
    try {
      const merchantDoc = await db.collection('merchants').doc(merchantId).get();
      if (merchantDoc.exists) {
        merchantData = merchantDoc.data();
      } else {
        // Fallback to user auth data
        const userRecord = await admin.auth().getUser(merchantId);
        merchantData = {
          name: userRecord.displayName || userRecord.email?.split('@')[0],
          email: userRecord.email,
          phone: userRecord.phoneNumber
        };
      }
    } catch (error) {
      console.log('Could not fetch merchant data:', error.message);
    }

    // Prepare QR data as query params
    const qrData = {
      merchantId: merchantId,
      businessName: businessName || merchantData?.name || 'Merchant Store',
      businessShortCode: process.env.MPESA_SHORTCODE,
      description: description || 'Payment',
      reference: reference || `QR_${Date.now()}`,
      timestamp: new Date().toISOString(),
      version: '1.0',
      type: 'merchant_payment',
      dynamicAmount: dynamicAmount
    };

    // Build the QR code URL (for the frontend /pay page)
    const frontendBaseUrl = process.env.FRONTEND_URL || "http://localhost:3001";
    const params = new URLSearchParams(qrData).toString();
    const qrUrl = `${frontendBaseUrl}/pay?${params}`;

    console.log('Dynamic QR Code URL generated for merchant:', qrUrl);

    res.status(200).json({
      success: true,
      message: 'QR Code generated successfully',
      data: {
        qrUrl,
        merchantId: merchantId,
        businessName: qrData.businessName,
        dynamicAmount: dynamicAmount
      }
    });

  } catch (error) {
    console.error('QR generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate QR code',
      error: error.message
    });
  }
}

// COMPLETE EXPORTS - All functions properly exported
module.exports = { 
  // Core M-Pesa functions
  triggerSTKPush, 
  handleCallback, 
  generateAccessToken, 
  triggerCustomerPayment,
  
  // Utility functions
  healthCheck,
  testMpesaConnection,
  testRegister,
  generateMerchantQR,
  
  //create Transaction
  createTransaction
};