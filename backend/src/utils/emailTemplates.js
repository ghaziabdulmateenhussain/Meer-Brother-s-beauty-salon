// Simple, dependency-free HTML email templates in the salon's black/gold theme.

function wrapper(title, bodyHtml) {
  return `
  <div style="font-family: Arial, sans-serif; background:#0b0b0b; padding:32px 16px;">
    <div style="max-width:520px;margin:0 auto;background:#141414;border:1px solid #C9A227;border-radius:12px;overflow:hidden;">
      <div style="background:#000000;padding:24px;text-align:center;border-bottom:1px solid #C9A227;">
        <h1 style="color:#C9A227;margin:0;font-size:20px;letter-spacing:1px;">MEER BROTHER'S SALON</h1>
        <p style="color:#e5c76b;margin:4px 0 0;font-size:12px;">Your Beauty, Our Passion</p>
      </div>
      <div style="padding:24px;color:#f2f2f2;font-size:14px;line-height:1.6;">
        <h2 style="color:#C9A227;font-size:16px;margin-top:0;">${title}</h2>
        ${bodyHtml}
      </div>
      <div style="padding:16px 24px;background:#000;color:#999;font-size:11px;text-align:center;">
        Near Post Office, Kunjah, District Gujrat, Pakistan &middot; 03430945567
      </div>
    </div>
  </div>`;
}

function newBookingAdminEmail(booking) {
  return wrapper(
    'New Booking Received',
    `<p>A new booking has been placed and is awaiting your approval.</p>
     <table style="width:100%;border-collapse:collapse;">
       <tr><td style="padding:4px 0;color:#999;">Booking ID</td><td style="padding:4px 0;">${booking.bookingId}</td></tr>
       <tr><td style="padding:4px 0;color:#999;">Customer</td><td style="padding:4px 0;">${booking.customerName}</td></tr>
       <tr><td style="padding:4px 0;color:#999;">Phone</td><td style="padding:4px 0;">${booking.customerPhone}</td></tr>
       <tr><td style="padding:4px 0;color:#999;">Service</td><td style="padding:4px 0;">${booking.serviceName}</td></tr>
       <tr><td style="padding:4px 0;color:#999;">Date</td><td style="padding:4px 0;">${booking.date}</td></tr>
       <tr><td style="padding:4px 0;color:#999;">Time</td><td style="padding:4px 0;">${booking.time}</td></tr>
       <tr><td style="padding:4px 0;color:#999;">Price</td><td style="padding:4px 0;">Rs. ${booking.finalPrice}</td></tr>
     </table>
     <p style="margin-top:16px;">Log in to the admin dashboard to approve or reject this booking.</p>`
  );
}

function bookingStatusCustomerEmail(booking, statusLabel, extraNote = '') {
  return wrapper(
    `Booking ${statusLabel}`,
    `<p>Hi ${booking.customerName},</p>
     <p>Your booking <strong>${booking.bookingId}</strong> for <strong>${booking.serviceName}</strong>
     on ${booking.date} at ${booking.time} has been <strong>${statusLabel}</strong>.</p>
     ${extraNote ? `<p>${extraNote}</p>` : ''}
     <p>Thank you for choosing Meer Brother's Salon.</p>`
  );
}

function bookingCancelledAdminEmail(booking) {
  return wrapper(
    'Booking Cancelled by Customer',
    `<p>Booking <strong>${booking.bookingId}</strong> for ${booking.serviceName} on ${booking.date} at ${booking.time}
     was cancelled by ${booking.customerName}.</p>`
  );
}

function passwordResetEmail(name, resetUrl) {
  return wrapper(
    'Reset Your Password',
    `<p>Hi ${name},</p>
     <p>We received a request to reset your password. Click the button below to choose a new one.
     This link expires in 30 minutes.</p>
     <p style="text-align:center;margin:24px 0;">
       <a href="${resetUrl}" style="background:#C9A227;color:#000;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">Reset Password</a>
     </p>
     <p>If you didn't request this, you can safely ignore this email.</p>`
  );
}

module.exports = {
  newBookingAdminEmail,
  bookingStatusCustomerEmail,
  bookingCancelledAdminEmail,
  passwordResetEmail,
};
