<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Order Status Update')
            ->line('Your order #' . $this->order->id . ' status has been updated to: ' . $this->order->status)
            ->line('Total Amount: $' . $this->order->total_amount)
            ->action('View Order', url('/orders/' . $this->order->id))
            ->line('Thank you for choosing our restaurant!');
    }

    public function toArray($notifiable)
    {
        return [
            'order_id' => $this->order->id,
            'status' => $this->order->status,
            'message' => 'Order #' . $this->order->id . ' status has been updated to: ' . $this->order->status
        ];
    }
} 