<?php

namespace App\Service;

use App\Mail\UserCredentialsMail;
use App\Models\Teacher;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

use function PHPUnit\Framework\isEmpty;

class UserService
{
    public function generateUser($model = null, $name = null, $email = null, $phone = null, $password = null)
    {
        try {
            if (!$name) {
                throw new Exception('Nama harus diisi');
            } else if (!$email) {
                throw new Exception('Email harus diisi');
            } else if (!$password) {
                throw new Exception('Password harus diisi');
            }

            DB::beginTransaction();

            $user = User::create([
                'name' => $name,
                'email' => $email,
                'phone' => $phone ?? null,
                'password' => bcrypt($password),
            ]);

            DB::commit();

            switch ($model) {
                case 'student':
                    $user->assignRole('student');
                    break;
                case 'teacher':
                    $user->assignRole('teacher');
                    break;
                case 'guardian':
                    $user->assignRole('guardian');
                    break;
                default:
                    throw new Exception('Model tidak valid');
            }

            // $user->sendEmailVerificationNotification();
            $this->sendCredentialsEmail($user, $password);

            return $user;

        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    private function sendCredentialsEmail(User $user, string $password)
    {
        Mail::to($user->email)->send(new UserCredentialsMail($user, $password));
    }
}
