import React, { useState } from 'react'
import RootLayout from '@/Layouts/RootLayout'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Main } from '@/components/layout/main'
import { Head, usePage } from '@inertiajs/react'
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { hasRole } from '@/utils/permissions'
import { EmptyState } from '@/components/empty-state'
import { FileX } from 'lucide-react'
import StudentSelector from '@/components/student-selector'
import { ViolationCard } from './components/violation-card'
import { SelectResponse, ViolationShowResponse } from './data/schema'
import { LocalSearch } from '@/components/local-search'
import ViolationTypeSelector from '@/components/violation-type-selector'

interface ContentProps {
    children: React.ReactNode;
    searchQuery: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedViolationType: string;
    onViolationTypeChange: (value: string) => void;
    violationTypes: any[];
}

function Content({ 
    children, 
    searchQuery, 
    onSearchChange,
    selectedViolationType,
    onViolationTypeChange,
    violationTypes
}: ContentProps) {
    return (
        <div className='flex flex-wrap items-center justify-between mb-6 space-y-2 gap-x-4'>
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Pelanggaran</h2>
                <p className='text-muted-foreground'>
                    Berikut adalah daftar pelanggaran yang tercatat dalam sistem
                </p>
            </div>
            <div className="flex items-center gap-4">
                <LocalSearch 
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder="Cari pelanggaran..."
                />
                <ViolationTypeSelector
                    violationTypes={violationTypes}
                    currentViolationTypeId={selectedViolationType}
                    onChange={onViolationTypeChange}
                />
                {children}
            </div>
        </div>
    )
}

function Show() {
    const { violation, violations = [], students = [] } = usePage<ViolationShowResponse>().props
    const { violationTypes } = usePage<SelectResponse>().props
    const isGuardian = hasRole('guardian')
    const isStudent = hasRole('student')
    const [selectedStudent, setSelectedStudent] = useState(students[0]?.id || '')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedViolationType, setSelectedViolationType] = useState('')

    const filteredViolations = violations.filter(v => {
        const matchesStudent = !selectedStudent || v.student.id === selectedStudent
        const matchesSearch = !searchQuery || 
            v.violation_type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.student.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = !selectedViolationType || v.violation_type.id === selectedViolationType
        return matchesStudent && matchesSearch && matchesType
    })

    return (
        <>
            <Head title="Detail Pelanggaran" />
            <Header fixed>
                <Search />
                <div className='flex items-center ml-auto space-x-4'>
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>
            <Main>
                <Content
                    searchQuery={searchQuery}
                    onSearchChange={(e) => setSearchQuery(e.target.value)}
                    selectedViolationType={selectedViolationType}
                    onViolationTypeChange={setSelectedViolationType}
                    violationTypes={violationTypes}
                >
                    {isGuardian && students && students.length > 1 && (
                        <StudentSelector
                            students={students}
                            currentStudentId={selectedStudent}
                            onChange={setSelectedStudent}
                        />
                    )}
                </Content>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredViolations.map(violation => (
                        <ViolationCard
                            key={violation.id}
                            violation={violation}
                        />
                    ))}
                </div>

                {filteredViolations.length === 0 && (
                    <EmptyState
                        icon={FileX}
                        title="Tidak ada pelanggaran"
                        description={searchQuery ? "Tidak ada pelanggaran yang sesuai dengan pencarian" : "Tidak ada data pelanggaran yang ditemukan"}
                    />
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
