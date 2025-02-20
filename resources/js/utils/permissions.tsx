import { usePage } from '@inertiajs/react';

export function can(permission: string) {
    // @ts-ignore
    const user = usePage().props.auth.user;
    if (!user || !user.roles) return false;

    return user.roles.some(role =>
        role.permissions?.some(perm => perm.name === permission)
    );
}

export function canAll(permissions: string[]) {
    return permissions.every(permission => can(permission));
}

export function canAny(permissions: string[]) {
    return permissions.some(permission => can(permission));
}

export function getAllPermissions() {
    // @ts-ignore
    const user = usePage().props.auth.user;
    if (!user || !user.roles) return [];

    return user.roles.flatMap(role => role.permissions?.map(perm => perm.name));
}

export function hasRole(roleName: string) {
    // @ts-ignore
    const user = usePage().props.auth.user;
    if (!user || !user.roles) return false;

    return user.roles.some(role => role.name === roleName);
}

export function hasAnyRole(roles: string[]) {
    return roles.some(role => hasRole(role));
}

export function hasAllRoles(roles: string[]) {
    return roles.every(role => hasRole(role));
}

export function getAllRoles() {
    // @ts-ignore
    const user = usePage().props.auth.user;
    if (!user || !user.roles) return [];

    return user.roles.map(role => role.name);
}

export function Can({ permission, children }: { permission: string, children: React.ReactNode }) {
    if (can(permission)) {
        return <>{children}</>;
    }
    return null;
}

export function Role({ role, children }: { role: string, children: React.ReactNode }) {
    if (hasRole(role)) {
        return <>{children}</>;
    }
    return null;
}

