import { IconClock, IconLock, IconShieldCheck, IconUser } from "@tabler/icons-react"

export const guardTypes = [
    {
        value: 'web',
        label: 'Web',
        icon: IconUser,
    },
    {
        value: 'api',
        label: 'API',
        icon: IconShieldCheck,
    },
    {
        value: 'sanctum',
        label: 'Sanctum',
        icon: IconLock,
    },
]

export const permissionCounts = [
    {
        label: '0-5',
        icon: IconLock,
    },
    {
        label: '6-15',
        icon: IconLock,
    },
    {
        label: '15+',
        icon: IconLock,
    },
]

export const lastUpdatedFilters = [
    {
        label: 'Today',
        value: 'today',
        icon: IconClock,
    },
    {
        label: 'This Week',
        value: 'week',
        icon: IconClock,
    },
    {
        label: 'This Month',
        value: 'month',
        icon: IconClock,
    },
]
