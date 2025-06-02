<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderConfirmationNotification extends Notification implements ShouldQueue
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
        $message = (new MailMessage)
            ->subject('Order Confirmation #' . $this->order->id)
            ->line('Thank you for your order!')
            ->line('Order Details:')
            ->line('Order Number: #' . $this->order->id)
            ->line('Total Amount: $' . $this->order->total_amount)
            ->line('Payment Method: ' . $this->order->payment_method)
            ->line('Status: ' . $this->order->status);

        if ($this->order->delivery_address) {
            $message->line('Delivery Address: ' . $this->order->delivery_address);
        }

        if ($this->order->special_instructions) {
            $message->line('Special Instructions: ' . $this->order->special_instructions);
        }

        return $message
            ->action('View Order', url('/orders/' . $this->order->id))
            ->line('We will notify you when your order status changes.');
    }

    public function toArray($notifiable)
    {
        return [
            'order_id' => $this->order->id,
            'total_amount' => $this->order->total_amount,
            'status' => $this->order->status,
            'message' => 'Order #' . $this->order->id . ' has been confirmed'
        ];
    }
} 