import {
    IconBrowserCheck,
    IconClockEdit,
    IconNotification,
    IconPalette,
    IconTool,
    IconUser,
} from '@tabler/icons-react'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import SidebarNav from '../components/sidebar-nav'
import { can } from '@/utils/permissions'
import { usePage } from '@inertiajs/react'

interface SettingsProps {
    children: React.ReactNode
}

export default function Settings({ children }: SettingsProps) {
    const sidebarNavItems = [
        {
            title: 'Profil',
            icon: <IconUser size={18} />,
            href: '/settings',
            visible: true,
        },
        {
            title: 'Akun',
            icon: <IconTool size={18} />,
            href: '/settings/account',
            visible: true,
        },
        // {
        //     title: 'Tampilan',
        //     icon: <IconPalette size={18} />,
        //     href: '/settings/appearance',
        //     visible: true,
        // },
        // {
        //     title: 'Notifikasi',
        //     icon: <IconNotification size={18} />,
        //     href: '/settings/notifications',
        //     visible: true,
        // },
        // {
        //     title: 'Tampilan',
        //     icon: <IconBrowserCheck size={18} />,
        //     href: '/settings/display',
        //     visible: true,
        // },
        {
            title: 'Absensi',
            icon: <IconClockEdit size={18} />,
            href: '/settings/attendanceSetting',
            visible: can('update_attendance_setting'),
        },
    ];

    const visibleNavItems = sidebarNavItems.filter(item => item.visible);

    return (
        <>
            <Header>
                <Search />
                <div className='flex items-center ml-auto space-x-4'>
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>

            <Main fixed>
                <div className='space-y-0.5'>
                    <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
                        Pengaturan
                    </h1>
                    <p className='text-muted-foreground'>
                        Kelola pengaturan akun dan preferensi email Anda.
                    </p>
                </div>
                <Separator className='my-4 lg:my-6' />
                <div className='flex flex-col flex-1 space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 lg:space-y-0'>
                    <aside className='top-0 lg:sticky lg:w-1/5'>
                        <SidebarNav items={visibleNavItems} />
                    </aside>
                    <div className='flex-1 w-full p-1 pr-4 overflow-y-hidden'>
                        {children}
                    </div>
                </div>
            </Main>
        </>
    )
}
