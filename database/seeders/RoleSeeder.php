<?php

namespace Database\Seeders;

use App\Models\User;
use App\Service\PermissionGenerator;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Str;

class RoleSeeder extends Seeder
{
    private $permissionGenerator;

    public function __construct(PermissionGenerator $permissionGenerator)
    {
        $this->permissionGenerator = $permissionGenerator;
        // Configure which models use softdeletes
        $this->permissionGenerator->setModelWithSoftDeletes([
            'Student',
            'Theacher',
            'Guardian',
        ]);

        // Configure which models have import/export
        $this->permissionGenerator->setModelWithImportExport([
            'Student',
            'Teacher'
        ]);
    }

    /**
     * Run the database seeds.
     */
    public function run()
    {
        $user = User::query()->where('email', 'hnzsama@gmail.com')->first();
        $admin = Role::firstOrCreate(['name' => 'admin']); // FirstOrCreate untuk menghindari duplikasi
        $teacher = Role::firstOrCreate(['name' => 'teacher']);
        $guardian = Role::firstOrCreate(['name' => 'guardian']);
        $student = Role::firstOrCreate(['name' => 'student']);
        $permissions = $this->permissionGenerator->generatePermissions();

        // Membuat semua permissions dan mengumpulkannya dalam satu array
        $allPermissions = [];
        foreach ($permissions as $modelPermissions) {
            foreach ($modelPermissions as $permissionName) {
                Permission::firstOrCreate(['name' => $permissionName]); // Membuat permission jika belum ada
                $allPermissions[] = $permissionName; // Menambahkan ke array
            }
        }

        $teacherPermissions = [
            "view_agency",
            // "view_any_announcement",
            // "view_announcement",
            "view_attendance",
            "create_attendance",
            "view_any_class_subject",
            "view_class_subject",
            "export_class_subject",
            "view_any_classroom",
            "view_classroom",
            "view_any_guardian",
            "view_guardian",
            "view_leave_request",
            "create_leave_request",
            "update_leave_request",
            "delete_leave_request",
            "export_leave_request",
            "view_any_student",
            "view_student",
            "update_student",
            "export_student",
            "view_any_subject_teacher",
            "view_subject_teacher",
            "export_subject_teacher",
        ];

        $guardianPermissions = [
            // "view_any_announcement",
            // "view_announcement",
            "view_leave_request",
            "create_leave_request",
            "update_leave_request",
            "delete_leave_request",
            "view_student",
            "view_teacher",
            "view_violation",
            "view_warning_letter"
        ];

        $studentPermissions = [
            "view_agency",
            // "view_any_announcement",
            // "view_announcement",
            "view_attendance",
            "create_attendance",
            "view_class_subject",
            "view_classroom",
            "view_guardian",
            "view_leave_request",
            "view_violation",
            "view_warning_letter"
        ];

        // Menyinkronkan semua permissions ke role
        $admin->syncPermissions($allPermissions);
        $teacher->syncPermissions($teacherPermissions);
        $guardian->syncPermissions($guardianPermissions);
        $student->syncPermissions($studentPermissions);

        // Menambahkan role ke user
        if ($user) {
            $user->assignRole($admin);
        } else {
            echo "User dengan email 'hnzsama@gmail.com' tidak ditemukan.";
        }
    }
}
