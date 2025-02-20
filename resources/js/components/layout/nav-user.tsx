import React from 'react'
import { Link } from '@inertiajs/react'
import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Sparkles,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'
import { LogoutDialog } from '../LogoutDialog'

export function NavUser({
    user,
}: {
    user: {
        name: string
        email: string
        avatar_url: string
    }
}) {
    const { isMobile } = useSidebar()
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = React.useState(false)

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size='lg'
                            className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                        >
                            <Avatar className='w-8 h-8 rounded-lg'>
                                <AvatarImage src={user.avatar_url} alt={user.name} />
                                <AvatarFallback className="rounded-lg">
                                    {user.name
                                        .split(" ")
                                        .map((word) => word[0])
                                        .join("")
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className='grid flex-1 text-sm leading-tight text-left'>
                                <span className='font-semibold truncate'>{user.name}</span>
                                <span className='text-xs truncate'>{user.email}</span>
                            </div>
                            <ChevronsUpDown className='ml-auto size-4' />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                        side={isMobile ? 'bottom' : 'right'}
                        align='end'
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className='p-0 font-normal'>
                            <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                                <Avatar className="w-8 h-8 rounded-lg">
                                    <AvatarImage src={user.avatar_url} alt={user.name} />
                                    <AvatarFallback className="rounded-lg">
                                        {user.name
                                            .split(" ")
                                            .map((word) => word[0])
                                            .join("")
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className='grid flex-1 text-sm leading-tight text-left'>
                                    <span className='font-semibold truncate'>{user.name}</span>
                                    <span className='text-xs truncate'>{user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link href='/settings/account'>
                                    <BadgeCheck />
                                    Account
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href='/settings/notifications'>
                                    <Bell />
                                    Notifications
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={(e) => {
                            e.preventDefault()
                            setIsLogoutDialogOpen(true)
                        }}>
                            <LogOut />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>

            <LogoutDialog
                open={isLogoutDialogOpen}
                onOpenChange={setIsLogoutDialogOpen}
            />
        </SidebarMenu>
    )
}
