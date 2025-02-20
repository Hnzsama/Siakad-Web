import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogoutDialog } from './LogoutDialog'

export function ProfileDropdown() {
    const { user } = usePage().props.auth
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = React.useState(false)

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='relative w-8 h-8 rounded-full'>
                    <Avatar className='w-8 h-8'>
                        <AvatarImage src={user.avatar_url || undefined} alt={user.name} />
                        <AvatarFallback>
                            {user.name
                                .split(" ")
                                .map((word) => word[0])
                                .join("")
                                .toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                        <p className='text-sm font-medium leading-none'>{user.name}</p>
                        <p className='text-xs leading-none text-muted-foreground'>
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href='/settings'>
                            Profile
                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href='/settings/account'>
                            Account
                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>New Team</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault()
                    setIsLogoutDialogOpen(true)
                }}>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>

            <LogoutDialog
                open={isLogoutDialogOpen}
                onOpenChange={setIsLogoutDialogOpen}
            />
        </DropdownMenu>
    )
}
