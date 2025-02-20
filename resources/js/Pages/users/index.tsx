import React from 'react'
import RootLayout from '@/Layouts/RootLayout'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Provider, { useResourceContext } from './context/context'
import { Main } from '@/components/layout/main'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { PrimaryButtons } from './components/primary-buttons'
import { Head, usePage } from '@inertiajs/react'
import { UsersResponse } from './data/schema'
import { Dialogs } from './components/dialogs'
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'

function Index() {
    const { users } = usePage<UsersResponse>().props
    const [tableInstance, setTableInstance] = React.useState<any>(null);

    return (
        <Provider>
            <Head title="Pengguna" />
            <Header fixed>
                <Search />
                <div className='flex items-center ml-auto space-x-4'>
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>
            <Main>
                <div className='flex flex-wrap items-center justify-between mb-2 space-y-2 gap-x-4'>
                    <div className='flex flex-wrap items-center justify-between mb-2 space-y-2 gap-x-4'>
                        <div>
                            <h2 className='text-2xl font-bold tracking-tight'>Pengguna</h2>
                            <p className='text-muted-foreground'>
                                Berikut adalah daftar pengguna Anda untuk bulan ini!
                            </p>
                        </div>
                    </div>
                    <PrimaryButtons data={users} />
                </div>
                <div className='flex-1 px-4 py-1 -mx-4 overflow-auto lg:flex-row lg:space-x-12 lg:space-y-0'>
                    <DataTable
                        data={users}
                        columns={columns}
                        onTableInstance={(instance) => setTableInstance(instance)}
                    />
                </div>
            </Main>
            <Dialogs table={tableInstance} />
        </Provider>
    )
}

// Definisikan nested layout
Index.layout = (page: React.ReactNode) => (
    <RootLayout>
        <AuthenticatedLayout>{page}</AuthenticatedLayout>
    </RootLayout>
)

export default Index
