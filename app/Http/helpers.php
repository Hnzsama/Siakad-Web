<?php

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

if (!function_exists('upluad_file'))
{
    /**
     * Upload a file to a specified directory.
     *
     * @param  Illuminate\Http\UploadedFile  $file
     * @param  string  $directory
     * @return string
     */
    function upload_file($file, $directory)
    {
        $extension = $file->getClientOriginalExtension();
        $fileName = Str::uuid() . '.' . $extension;
        Storage::disk('public')->putFileAs($directory, $file, $fileName);

        return "/storage/$directory/$fileName";
    }
}

if (!function_exists('remove_file'))
{
    /**
     * Remove a file from the storage if it exists.
     *
     * @param  string  $filePath  The path to the file to be removed.
     * @return bool  True if the file was successfully deleted, false otherwise.
     */
    function remove_file($filePath)
    {
        if ($filePath && Storage::disk('public')->exists($filePath)) {
            return Storage::disk('public')->delete($filePath);
        }

        return false;
    }
}
