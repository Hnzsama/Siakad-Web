<!DOCTYPE html>
<html>

<head>
    <title>Informasi Akun</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body class="p-6 bg-gray-100">
    <div class="max-w-2xl p-8 mx-auto bg-white rounded-lg shadow-md">
        <!-- Header -->
        <div class="pb-4 mb-6 border-b">
            <h2 class="text-2xl font-bold text-gray-800">Selamat Datang, {{ $user->name }}!</h2>
        </div>

        <!-- Content -->
        <div class="space-y-6 text-gray-600">
            <p class="text-lg">
                Akun Anda telah berhasil dibuat. Berikut adalah informasi login Anda:
            </p>

            <!-- Credentials Box -->
            <div class="p-6 space-y-3 rounded-lg bg-gray-50">
                <div class="flex items-center">
                    <span class="w-20 text-gray-500">Email:</span>
                    <strong class="text-gray-800">{{ $user->email }}</strong>
                </div>
                <div class="flex items-center">
                    <span class="w-20 text-gray-500">Password:</span>
                    <strong class="text-gray-800">{{ $password }}</strong>
                </div>
            </div>

            <!-- Login Button -->
            <div class="py-4 text-center">
                <a href="{{ config('app.url') }}/login"
                    class="inline-block px-6 py-3 font-semibold text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700">
                    Login Sekarang
                </a>
            </div>

            <!-- Security Notice -->
            <div class="p-4 my-4 border-l-4 border-yellow-400 bg-yellow-50">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="w-5 h-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-yellow-700">
                            Demi keamanan, kami sarankan untuk segera mengubah password Anda setelah login pertama.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="pt-6 text-center text-gray-500">
                <p>Terima kasih!</p>
            </div>
        </div>
    </div>
</body>

</html>
