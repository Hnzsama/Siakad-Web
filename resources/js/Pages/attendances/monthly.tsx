import React from 'react';
import RootLayout from '@/Layouts/RootLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { Header } from '@/components/layout/header';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { AttendanceHeader } from './components/attendance-header';
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";
import { MonthlyTableHeader } from './components/monthly-table-header';
import { AttendanceBadge } from './components/attendance-badge';
import { cn } from '@/lib/utils';
import { MonthlyResponse } from './data/schema';

type MonthName =
    | "January" | "February" | "March" | "April" | "May" | "June"
    | "July" | "August" | "September" | "October" | "November" | "December";

type MonthLabels = {
    [key in MonthName]: string;
};

type ContentProps = Pick<MonthlyResponse, 'attendances' | 'year'>;

function MonthlyContent() {
    const { attendances, year } = usePage<MonthlyResponse>().props;

    const monthLabels: MonthLabels = {
        "January": "Januari",
        "February": "Februari",
        "March": "Maret",
        "April": "April",
        "May": "Mei",
        "June": "Juni",
        "July": "Juli",
        "August": "Agustus",
        "September": "September",
        "October": "Oktober",
        "November": "November",
        "December": "Desember"
    };

    const months: MonthName[] = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <>
            <Head title="Rekap Absensi Bulanan" />
            <Header fixed>
                <Search />
                <div className='flex items-center ml-auto space-x-4'>
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>

            <div className="peer-[.header-fixed]/header:mt-16 h-[calc(100vh-64px)] border-t overflow-hidden">
                <div className="flex flex-col h-full">
                    <AttendanceHeader />
                    <div className="flex-1 overflow-auto">
                        <Table className="border-collapse" style={{
                            width: `${(31 * 60) + 100}px`,
                        }}>
                            <MonthlyTableHeader />
                            <TableBody>
                                {months.map((month) => (
                                    <TableRow key={month}>
                                        <TableCell className={cn(
                                            "sticky left-0 z-20",
                                            "w-[100px] min-w-[100px]",
                                            "font-medium text-center",
                                            "bg-background",
                                            "border-r"
                                        )}>
                                            {monthLabels[month]} {/* Now properly typed */}
                                        </TableCell>
                                        {Array.from({ length: 31 }, (_, i) => (
                                            <TableCell
                                                key={i + 1}
                                                className={cn(
                                                    "p-2 w-[60px] min-w-[60px]",
                                                    "border-r last:border-r-0",
                                                    "h-[4.5rem]"
                                                )}
                                            >
                                                <div className="flex flex-col gap-1.5"> {/* Added gap container */}
                                                    {attendances[month]?.[i + 1]?.map((record, idx) => (
                                                        <AttendanceBadge
                                                            key={idx}
                                                            time={record.time}
                                                            type={record.type}
                                                        />
                                                    ))}
                                                </div>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </>
    );
}

// Define nested layout
MonthlyContent.layout = (page: React.ReactNode) => (
    <RootLayout>
        <AuthenticatedLayout>{page}</AuthenticatedLayout>
    </RootLayout>
);

export default MonthlyContent;
