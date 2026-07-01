<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Placemate</title>
    <style>
        /* 2. Media queries for screens smaller than 600px */
        @media screen and (max-width: 600px) {
            .email-container {
                padding: 10px !important;
            }
            .email-body {
                padding: 20px !important;
            }
            .action-button {
                display: block !important;
                width: 100% !important;
                box-sizing: border-box !important;
            }
        }
    </style>
</head>
<body style="font-family: Arial, sans-serif; color: #333333; line-height: 1.6; background-color: #f4f4f4; margin: 0; padding: 0;">
    
    <div class="email-container" style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; box-sizing: border-box;">
        <div class="email-body" style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            
            <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; margin-top: 0;">Welcome to Placemate!</h2>
            
            <p>Hi <strong>${ownerName}</strong>,</p>
            
            <p>You have been invited by <strong>${collegeName}</strong> to join Placemate — your centralized platform for managing interview schedules seamlessly.</p>
            
            <p>To get started, please complete your profile and confirm your availability. This will ensure you don't miss any upcoming opportunities.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://placemate-omega.vercel.app" class="action-button" style="background-color: #3498db; color: #ffffff; padding: 14px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Complete Your Onboarding</a>
            </div>
            
            <p>If you have any questions, please reach out to your placement coordinator at ${collegeName}.</p>
            
            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">
            <p style="font-size: 12px; color: #7f8c8d; text-align: center; margin-bottom: 0;">
                &copy; 2026 Placemate. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>