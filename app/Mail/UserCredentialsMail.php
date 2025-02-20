<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class UserCredentialsMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $password;

    /**
     * Membuat instance pesan baru.
     */
    public function __construct(User $user, string $password)
    {
        $this->user = $user;
        $this->password = $password;
    }

    /**
     * Mendapatkan envelope pesan.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Informasi Akun - ' . config('app.name'),
        );
    }

    /**
     * Mendapatkan definisi konten pesan.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.user-credentials',
        );
    }

    /**
     * Mendapatkan lampiran untuk pesan.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}