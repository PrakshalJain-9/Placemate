<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333333; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        
        <h2 style="color: #27ae60; border-bottom: 2px solid #2ecc71; padding-bottom: 10px;">Verify Your Email Address</h2>
        
        <p>Hi <strong>${ownerName}</strong>,</p>
        
        <p>Thank you for registering. To complete your setup and secure your account, please verify your email address using the One-Time Password (OTP) below.</p>
        
        <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-radius: 8px; border: 1px dashed #cccccc;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2c3e50;">
                ${otp}
            </span>
        </div>
        
        <p>This code is valid for <strong>10 minutes</strong>. Please do not share this code with anyone.</p>
        
        <p>If you did not request this verification, you can safely ignore this email.</p>
        
        <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">
        <p style="font-size: 12px; color: #7f8c8d; text-align: center;">
            &copy; 2026 Placemate. All rights reserved.
        </p>
    </div>
</body>
</html>