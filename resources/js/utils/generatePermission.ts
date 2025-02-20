import { permissionsName } from "@/types/app/permissionName"
import { can } from "@/utils/permissions"
import { snakeCase } from "lodash"

export const generatePermissions = (modelName: string): permissionsName => {
    const permissionKeys = {
        viewAny: true,
        view: true,
        create: true,
        update: true,
        delete: true,
        restore: true,
        forceDelete: true,
        export: true,
        import: true
    } as permissionsName

    return Object.fromEntries(
        Object.keys(permissionKeys).map(key => [
            key,
            can(`${snakeCase(key)}_${modelName}`)
        ])
    ) as permissionsName
}
