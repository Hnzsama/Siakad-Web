import { cn } from '@/lib/utils';
import { AppSidebar } from '@/components/layout/app-sidebar';
import SkipToMain from '@/components/skip-to-main';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <SkipToMain />
            <AppSidebar />
            <div
                id='content'
                className={cn(
                    `max-w-full w-full ${!route().current('classSubjects.edit') && !route().current('classSubjects.show') && !route().current('attendances.monthly') && 'ml-auto'}`,
                    'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
                    'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
                    'transition-[width] ease-linear duration-200',
                    'h-svh flex flex-col',
                    'group-data-[scroll-locked=1]/body:h-full',
                    'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh'
                )}
            >
                {children}
            </div>
        </>
    );
}
