<?php

namespace App\Http\Controllers;

use App\Jobs\ImportStudentJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentImportController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|file|mimes:csv,txt|max:2048',
                'classroom_id' => 'required|exists:classrooms,id'
            ]);

            // // Change from private storage to public
            $extension = $request->file('file')->getClientOriginalExtension();
            if (strtolower($extension) !== 'csv') {
                throw new \Exception('File must be a CSV file');
            }

            // Simpan dengan ekstensi .csv secara eksplisit
            $path = $request->file('file')->storeAs(
                'imports/temp',
                time() . '_' . uniqid() . '.csv',
                'public'
            );

            ImportStudentJob::dispatch(
                $path,
                $request->classroom_id,
                Auth::user()->id
            );

            return redirect()->back()->with('success', 'Import process has been started');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors());
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to import students']);
        }
    }
}
