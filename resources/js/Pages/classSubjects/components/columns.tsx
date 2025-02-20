import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format, isWithinInterval } from 'date-fns';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { GroupedClassSubject } from '../data/schema';
import { BookOpen, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExtendedColumnMeta } from '@/types/app/extendedColumnMeta';
import { DateRange } from 'react-day-picker';

export const columns: ColumnDef<GroupedClassSubject>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <div className='pl-2 bg-background'>
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className='pl-2 bg-background'>
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-[2px]"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
        meta: {
            className: cn('bg-background')
        }
    },
    {
        accessorKey: 'classroom.name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Kelas" />
        ),
        cell: ({ row }) => <span className='font-medium'>{row.original.classroom.name}</span>,
        meta: {
            label : 'Kelas',
            className: cn('bg-background')
        } as ExtendedColumnMeta<GroupedClassSubject>,
    },
    {
        id: 'subjects',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Mata Pelajaran" />
        ),
        cell: ({ row }) => (
            <div className="h-auto max-h-[500px] overflow-y-auto p-2 sm:p-4 bg-background">
                <div className="grid grid-cols-1 gap-2 xs:grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 sm:gap-4">
                    {row.original.subjects?.filter(subject => subject.subject_teacher)
                        .map((subject, index) => (
                            <div
                                key={subject.id}
                                className="flex flex-col min-h-[120px] h-full gap-1.5 p-2 sm:p-3
                                    border border-border/50
                                    bg-muted/50 dark:bg-muted/30
                                    hover:bg-primary/5 hover:border-primary/20
                                    hover:shadow-sm hover:scale-[1.01]
                                    transition-all duration-200 ease-in-out rounded-md"
                            >
                                <div className="flex items-center justify-between flex-shrink-0 w-full">
                                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                                        <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                                        <span className="text-sm font-medium truncate sm:text-base">
                                            {subject.subject_teacher?.subject?.name || 'No Subject'}
                                        </span>
                                    </div>
                                    <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] text-nowrap font-medium bg-primary/10 text-primary rounded-full flex-shrink-0 ml-2">
                                        {subject.subject_teacher?.subject?.code || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-muted-foreground flex-shrink-0">
                                    <GraduationCap className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                    <span className="truncate">{subject.subject_teacher?.teacher?.name || 'No Teacher'}</span>
                                </div>
                                <div className="text-[10px] sm:text-[11px] text-muted-foreground/80 mt-auto flex-shrink-0">
                                    {subject.day} • {format(new Date(`1970-01-01T${subject.start_time}`), 'HH:mm')} -
                                    {format(new Date(`1970-01-01T${subject.end_time}`), 'HH:mm')}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        ),
        meta: {
            label: 'Mata Pelajaran',
            className: 'w-full sm:w-[800px] bg-card'
        } as ExtendedColumnMeta<GroupedClassSubject>,
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Dibuat Pada' />
        ),
        cell: ({ row }) => format(new Date(row.getValue('created_at')), 'dd MMM yyyy'),
        filterFn: (row, id, filterValue: DateRange | undefined) => {
            if (!filterValue?.from) return true;

            const rowDate = new Date(row.getValue(id));
            const from = new Date(filterValue.from);
            const to = filterValue.to ? new Date(filterValue.to) : from;

            return isWithinInterval(rowDate, { start: from, end: to });
        },
        enableSorting: false,
        enableGlobalFilter: false,
        enableHiding: false,
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
        enableHiding: true,
        meta: {
            className: cn('bg-background')
        }
    },
];
