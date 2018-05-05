<?php

namespace App\Mail;

use App\User;
use Bogardo\Mailgun\Facades\Mailgun;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class Registration extends Mailable
{
    use Queueable, SerializesModels;

    protected $user;
    /**
     * Create a new message instance.
     *
     * @param User $user
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        //$view = $this->markdown('emails.register');
        Mailgun::send('emails.register', ['user' => $this->user], function($message) {
            $message->subject('Welcome!')->to($this->user->email, $this->user->name);
        });

//        return $this->subject('Welcome to ThisDay!')->markdown('emails.register')
//            ->with(['user' => $this->user]);
    }
}
