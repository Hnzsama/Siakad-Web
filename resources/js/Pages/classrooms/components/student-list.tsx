import { ClassroomShowResponse } from '../data/schema'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreVertical, Edit, UserCircle, Calendar, Download, Search as SearchIcon, GraduationCap } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Input } from "@/components/ui/input"
import { Pagination } from '@/components/pagination'
import { useState } from 'react'

interface StudentListProps {
    students: ClassroomShowResponse['classroom']['students']
}

export function StudentList({ students }: StudentListProps) {
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    if (!students?.length) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/10">
                <GraduationCap className="w-12 h-12 mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Tidak ada siswa</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Belum ada siswa yang terdaftar di kelas ini.
                </p>
            </div>
        );
    }

    const filteredStudents = students
        .filter(student =>
            student.name.toLowerCase().includes(search.toLowerCase()) ||
            student.nis.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name));

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
    const currentStudents = filteredStudents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <SearchIcon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <Input
                        type="search"
                        placeholder="Cari berdasarkan nama atau NIS..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 w-[300px]"
                    />
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <TableRow>
                            <TableHead className="w-[60px] text-center">No</TableHead>
                            <TableHead className="min-w-[120px]">NIS</TableHead>
                            <TableHead className="min-w-[200px]">Nama</TableHead>
                            <TableHead className="min-w-[120px]">Jenis Kelamin</TableHead>
                            <TableHead className="min-w-[100px]">Status</TableHead>
                            <TableHead className="min-w-[150px]">Poin Pelanggaran</TableHead>
                            <TableHead className="min-w-[120px]">Tanggal Masuk</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentStudents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    Tidak ada data
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentStudents.map((student, index) => (
                                <TableRow key={student.id} className="hover:bg-muted/50">
                                    <TableCell className="text-center">
                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                    </TableCell>
                                    <TableCell className="font-medium">{student.nis}</TableCell>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={student.gender === 'Male' ? 'default' : 'secondary'}>
                                            {student.gender === 'Male' ? 'Laki-laki' : 'Perempuan'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            student.status === 'Active' ? 'outline' :
                                            student.status === 'Graduated' ? 'default' : 'destructive'
                                        }>
                                            {student.status === 'Active' ? 'Aktif' : student.status === 'Graduated' ? 'Lulus' : 'Dikeluarkan'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <HoverCard>
                                            <HoverCardTrigger>
                                                <div className="flex items-center space-x-2">
                                                    <Progress
                                                        value={student.violation_points}
                                                        className="w-[60px]"
                                                        indicatorClassName={cn(
                                                            student.violation_points >= 80 ? "bg-green-500" :
                                                            student.violation_points >= 50 ? "bg-yellow-500" : "bg-red-500"
                                                        )}
                                                    />
                                                    <span>{student.violation_points}</span>
                                                </div>
                                            </HoverCardTrigger>
                                            <HoverCardContent>
                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-semibold">Poin Pelanggaran</h4>
                                                    <p className="text-sm">
                                                        {student.violation_points >= 80 ? "Baik" :
                                                        student.violation_points >= 50 ? "Perhatian" : "Peringatan"}
                                                    </p>
                                                </div>
                                            </HoverCardContent>
                                        </HoverCard>
                                    </TableCell>
                                    <TableCell>{format(new Date(student.enrollment_date), 'dd/MM/yyyy')}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Menampilkan {currentStudents.length} dari {filteredStudents.length} siswa
                </p>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    )
}
