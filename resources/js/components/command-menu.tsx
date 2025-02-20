import React from 'react'
import { router } from '@inertiajs/react'
import {
    IconArrowRightDashed,
    IconDeviceLaptop,
    IconMoon,
    IconSun,
} from '@tabler/icons-react'
import { useSearch } from '@/context/search-context'
import { useTheme } from './theme-provider'
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command'
import { SidebarData } from './layout/data/sidebar-data'
import { ScrollArea } from '@/components/ui/scroll-area'

export function CommandMenu() {
    const { setTheme } = useTheme()
    const { open, setOpen } = useSearch()
    const sidebarData = SidebarData()

    // Filter authorized navigation similar to AppSidebar
    const authorizedNavigation = {
        ...sidebarData,
        navGroups: sidebarData.navGroups.map(group => ({
            ...group,
            items: group.items.filter(item => {
                if ('items' in item && item.items) {
                    item.items = item.items.filter(subItem =>
                        subItem.visible !== false
                    )
                    return item.items.length > 0
                }
                return item.visible !== false
            })
        })).filter(group => group.items.length > 0)
    }

    const runCommand = React.useCallback(
        (command: () => unknown) => {
            setOpen(false)
            command()
        },
        [setOpen]
    )

    return (
        <CommandDialog modal open={open} onOpenChange={setOpen}>
            <CommandInput
                placeholder='Type a command or search...'
                className="border-0 focus:outline-none focus:ring-0 focus:ring-offset-0"
            />
            <CommandList>
                <ScrollArea type='hover' className='pr-1 h-72'>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {authorizedNavigation.navGroups.map((group) => (
                        <CommandGroup key={group.title} heading={group.title}>
                            {group.items.map((navItem, i) => {
                                if (navItem.url)
                                    return (
                                        <CommandItem
                                            key={`${navItem.url}-${i}`}
                                            value={navItem.title}
                                            onSelect={() => {
                                                runCommand(() => router.visit(navItem.url))
                                            }}
                                        >
                                            <div className='flex items-center justify-center w-4 h-4 mr-2'>
                                                <IconArrowRightDashed className='size-2 text-muted-foreground/80' />
                                            </div>
                                            {navItem.title}
                                        </CommandItem>
                                    )

                                return navItem.items?.map((subItem, i) => (
                                    <CommandItem
                                        key={`${subItem.url}-${i}`}
                                        value={subItem.title}
                                        onSelect={() => {
                                            runCommand(() => router.visit(subItem.url))
                                        }}
                                    >
                                        <div className='flex items-center justify-center w-4 h-4 mr-2'>
                                            <IconArrowRightDashed className='size-2 text-muted-foreground/80' />
                                        </div>
                                        {subItem.title}
                                    </CommandItem>
                                ))
                            })}
                        </CommandGroup>
                    ))}
                    <CommandSeparator />
                    <CommandGroup heading='Theme'>
                        <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
                            <IconSun /> <span>Light</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
                            <IconMoon className='scale-90' />
                            <span>Dark</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
                            <IconDeviceLaptop />
                            <span>System</span>
                        </CommandItem>
                    </CommandGroup>
                </ScrollArea>
            </CommandList>
        </CommandDialog>
    )
}
