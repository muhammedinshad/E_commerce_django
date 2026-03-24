from celery import shared_task
from apps.smtp.smtp import send_welcome_email,send_order_email
from apps.accounts.models import UserModel
from apps.userside.order.models import Order 

@shared_task
def send_welcome_email_task(user_id):
    try:
        user = UserModel.objects.get(id=user_id)
        send_welcome_email(user)
    except UserModel.DoesNotExist:
        pass
    

@shared_task
def send_order_email_task(order_id):
    try:
        order = Order.objects.get(id=order_id)
        send_order_email(
            user_email  = order.user.email,
            order_id    = order.id,
            order_items = order.items.all(),
            total_price = order.total_price,
            address     = order.address,
            username    = order.user.username,
        )
    except Order.DoesNotExist:
        pass