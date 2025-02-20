import { IconCash, IconSchool, IconShield, IconUsersGroup, IconUserShield } from "@tabler/icons-react";

export function Data() {

    const userTypes = [
        {
            label: 'Superadmin',
            value: 'superadmin',
            icon: IconShield,
        },
        {
            label: 'Admin',
            value: 'admin',
            icon: IconUserShield,
        },
        {
            label: 'Manager',
            value: 'manager',
            icon: IconUsersGroup,
        },
        {
            label: 'Cashier',
            value: 'cashier',
            icon: IconCash,
        },
    ]

    return { userTypes };
}
