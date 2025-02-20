import React from 'react';
import RootLayout from '@/Layouts/RootLayout'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Main } from '@/components/layout/main'
import { Head, usePage } from '@inertiajs/react'
import { AgencyShowResponse } from './data/schema'
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { hasAnyRole } from '@/utils/permissions'
import { AgencyList } from './components/agency-list'
import { AgencyDetail } from './components/agency-detail'

function Show() {
    const { agency, agencies } = usePage<AgencyShowResponse>().props;
    const isMultipleView = hasAnyRole(['student', 'teacher']);

    return (
        <>
            <Head title={isMultipleView ? "Daftar Instansi" : `Instansi: ${agency?.name}`} />
            <Header fixed>
                <Search />
                <div className='flex items-center ml-auto space-x-4'>
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>
            <Main>
                {isMultipleView ? (
                    <AgencyList agencies={agencies || []} />
                ) : (
                    agency && <AgencyDetail agency={agency} />
                )}
            </Main>
        </>
    )
}

Show.layout = (page: React.ReactNode) => (
    <RootLayout>
        <AuthenticatedLayout>{page}</AuthenticatedLayout>
    </RootLayout>
)

export default Show
