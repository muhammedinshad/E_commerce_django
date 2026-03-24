from django.core.mail import send_mail,EmailMultiAlternatives
from django.conf import settings

def send_order_email(user_email, order_id, order_items, total_price, address, username):

    items_html = ""
    for item in order_items:
        items_html += f"""
        <tr>
            <td style="padding:8px; border:1px solid #ddd;">{item.product.name}</td>
            <td style="padding:8px; border:1px solid #ddd;">{item.quantity}</td>
            <td style="padding:8px; border:1px solid #ddd;">₹{item.price}</td>
        </tr>
        """

    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h1 style="color: #FF3B30;">Order Confirmed! 🎉</h1>
        <p>Hi <strong>{username}</strong>,</p>
        <p>Your order <strong>#{order_id}</strong> has been placed successfully.</p>

        <h3>Order Details</h3>
        <table style="width:100%; border-collapse:collapse; margin:20px 0;">
            <thead>
                <tr style="background:#f5f5f5;">
                    <th style="padding:8px; border:1px solid #ddd; text-align:left;">Product</th>
                    <th style="padding:8px; border:1px solid #ddd; text-align:left;">Qty</th>
                    <th style="padding:8px; border:1px solid #ddd; text-align:left;">Price</th>
                </tr>
            </thead>
            <tbody>
                {items_html}
            </tbody>
        </table>

        <p><strong>Delivery Address:</strong> {address}</p>
        <p style="font-size:18px;"><strong>Total: ₹{total_price}</strong></p>

        <p style="margin-top:30px; color:#888; font-size:12px;">
            © 2026 ShoeCart. All rights reserved.
        </p>
    </div>
    """

    text_content = f"Order #{order_id} confirmed! Total: ₹{total_price}"

    email = EmailMultiAlternatives(
        subject    = f"Order #{order_id} Confirmed! 🎉",
        body       = text_content,
        from_email = settings.EMAIL_HOST_USER,
        to         = [user_email],
    )
    email.attach_alternative(html_content, "text/html")
    email.send(fail_silently=False)
    

def send_welcome_email(user):
    subject    = "Welcome to ShoeCart! 🎉"
    from_email = settings.EMAIL_HOST_USER
    to_email   = [user.email]
    
    text_content = f"Hi {user.username}, Welcome to ShoeCart!"

    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h1 style="color: #FF3B30;">Welcome to ShoeCart! 🎉</h1>
        <p>Hi <strong>{user.username}</strong>,</p>
        <p>Your account has been created successfully.</p>
        <table style="width:100%; border-collapse:collapse; margin:20px 0;">
            <tr>
                <td style="padding:8px; border:1px solid #ddd;">Email</td>
                <td style="padding:8px; border:1px solid #ddd;">{user.email}</td>
            </tr>
            <tr>
                <td style="padding:8px; border:1px solid #ddd;">Username</td>
                <td style="padding:8px; border:1px solid #ddd;">{user.username}</td>
            </tr>
        </table>
        <a href="http://localhost:5173" 
           style="background:#FF3B30; color:white; padding:12px 24px; 
                  border-radius:8px; text-decoration:none; font-weight:bold;">
            Start Shopping →
        </a>
        <p style="margin-top:30px; color:#888; font-size:12px;">
            © 2026 ShoeCart. All rights reserved.
        </p>
    </div>
    """

    email = EmailMultiAlternatives(subject, text_content, from_email, to_email)
    email.attach_alternative(html_content, "text/html")
    email.send(fail_silently=True)