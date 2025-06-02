<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewReviewNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $review;

    public function __construct(Review $review)
    {
        $this->review = $review;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('New Review Received')
            ->line('A new review has been submitted for ' . $this->review->menuItem->name)
            ->line('Rating: ' . $this->review->rating . '/5')
            ->line('Comment: ' . $this->review->comment)
            ->action('View Review', url('/admin/reviews/' . $this->review->id))
            ->line('Please review and approve if appropriate.');
    }

    public function toArray($notifiable)
    {
        return [
            'review_id' => $this->review->id,
            'menu_item_id' => $this->review->menu_item_id,
            'rating' => $this->review->rating,
            'message' => 'New review received for ' . $this->review->menuItem->name
        ];
    }
} 