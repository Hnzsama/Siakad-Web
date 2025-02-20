import { useState, type JSX } from 'react'
import { Link, usePage, router } from '@inertiajs/react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    items: {
        href: string
        title: string
        icon: JSX.Element
    }[]
}

export default function SidebarNav({
    className,
    items,
    ...props
}: SidebarNavProps) {
    const { url } = usePage()
    const pathname = new URL(url, window.location.origin).pathname
    const [val, setVal] = useState(pathname ?? '/settings')

    const handleSelect = (e: string) => {
        setVal(e)
        router.visit(e)
    }

    return (
        <>
            <div className='p-2 md:hidden'>
                <Select value={val} onValueChange={handleSelect}>
                    <SelectTrigger className='h-12 sm:w-48'>
                        <SelectValue placeholder='Theme' />
                    </SelectTrigger>
                    <SelectContent>
                        {items.map((item) => (
                            <SelectItem key={item.href} value={item.href}>
                                <div className='flex px-2 py-1 gap-x-4'>
                                    <span className='scale-125'>{item.icon}</span>
                                    <span className='text-md'>{item.title}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <ScrollArea
                type='always'
                className='hidden w-full px-1 py-2 bg-background md:block min-w-40'
            >
                <nav
                    className={cn(
                        'flex py-1 space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
                        className
                    )}
                    {...props}
                >
                    {items.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                buttonVariants({ variant: 'ghost' }),
                                pathname === item.href
                                    ? 'bg-muted hover:bg-muted'
                                    : 'hover:bg-transparent hover:underline',
                                'justify-start'
                            )}
                        >
                            <span className='mr-2'>{item.icon}</span>
                            {item.title}
                        </Link>
                    ))}
                </nav>
                <ScrollBar orientation='horizontal'/>
            </ScrollArea>
        </>
    )
}
