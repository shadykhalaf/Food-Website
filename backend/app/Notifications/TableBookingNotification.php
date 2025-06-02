<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TableBookingNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $booking;

    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Table Booking ' . ucfirst($this->booking->status))
            ->line('Your table booking has been ' . $this->booking->status)
            ->line('Date: ' . $this->booking->booking_date->format('F j, Y'))
            ->line('Time: ' . $this->booking->booking_time->format('g:i A'))
            ->line('Table Number: ' . $this->booking->table->table_number)
            ->line('Number of Guests: ' . $this->booking->number_of_guests)
            ->action('View Booking', url('/bookings/' . $this->booking->id))
            ->line('Thank you for choosing our restaurant!');
    }

    public function toArray($notifiable)
    {
        return [
            'booking_id' => $this->booking->id,
            'status' => $this->booking->status,
            'booking_date' => $this->booking->booking_date,
            'booking_time' => $this->booking->booking_time,
            'message' => 'Your table booking has been ' . $this->booking->status
        ];
    }
} 