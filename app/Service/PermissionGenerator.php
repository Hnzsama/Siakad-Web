<?php

namespace App\Service;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;

class PermissionGenerator
{
    private $modelWithSoftDeletes = [];
    private $modelWithImportExport = [];

    public function setModelWithSoftDeletes(array $models)
    {
        $this->modelWithSoftDeletes = $models;
        return $this;
    }

    public function setModelWithImportExport(array $models)
    {
        $this->modelWithImportExport = $models;
        return $this;
    }

    public function generatePermissions()
    {
        $modelPermissions = [];
        $models = $this->getModels();

        foreach ($models as $model) {
            $modelName = Str::snake($model);

            // Base permissions that all models have
            $permissions = [
                "view_any_{$modelName}",
                "view_{$modelName}",
                "create_{$modelName}",
                "update_{$modelName}",
                "delete_{$modelName}",
                "export_{$modelName}", // Default export permission for all models
            ];

            // Add soft delete permissions if configured
            if (in_array($model, $this->modelWithSoftDeletes)) {
                $permissions = array_merge($permissions, [
                    "restore_{$modelName}",
                    "force_delete_{$modelName}",
                ]);
            }

            // Add import permission if configured
            if (in_array($model, $this->modelWithImportExport)) {
                $permissions[] = "import_{$modelName}";
            }

            $modelPermissions[$model] = $permissions;
        }

        // Special handling for Role model
        $modelPermissions['Role'] = $this->getRolePermissions();

        return $modelPermissions;
    }

    private function getModels()
    {
        $models = [];
        $modelFiles = File::allFiles(app_path('Models'));

        foreach ($modelFiles as $file) {
            $models[] = str_replace('.php', '', $file->getFilename());
        }

        return $models;
    }

    private function getRolePermissions()
    {
        return [
            "view_any_role",
            "view_role",
            "create_role",
            "update_role",
            "delete_role",
            "restore_role",
            "force_delete_role",
            "export_role",
            "import_role",
        ];
    }
}
