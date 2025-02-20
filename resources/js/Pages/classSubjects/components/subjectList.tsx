import { SubjectTeacher } from '@/types/app/timetable';
import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import {
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarInput
} from "@/components/ui/sidebar";
import { BookOpen, GraduationCap, Coffee, Filter } from 'lucide-react'; // Add Filter icon
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BreakCard } from './BreakCard';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface SubjectListProps {
    subjects: string[];
    activeSubjectTeachers: SubjectTeacher[];
}

interface BreakSchedule {
    id: string;
    name: string;
    duration: number;
}

export const SubjectList: React.FC<SubjectListProps> = ({ subjects, activeSubjectTeachers }) => {
    const [breakDuration, setBreakDuration] = React.useState<number>(15);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedBreak, setSelectedBreak] = React.useState<BreakSchedule | null>(null);
    const [searchTerm, setSearchTerm] = React.useState<string>('');
    const [subjectType, setSubjectType] = React.useState<string>('all');

    const droppableId = React.useMemo(() => "subjects", []);

    const droppableProps = React.useMemo(() => ({
        droppableId,
        type: "DEFAULT",
        mode: "standard" as const,
        direction: "vertical" as const,
        renderClone: undefined,
        ignoreContainerClipping: false,
        isCombineEnabled: false,
        isDropDisabled: true
    }), [droppableId]);

    const draggableProps = React.useCallback((item: SubjectTeacher, index: number) => ({
        draggableId: item.id,
        index: index
    }), []);

    const filteredSubjects = React.useMemo(() => {
        return activeSubjectTeachers.filter(item => {
            const matchesSearch = (
                item.subject?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.subject?.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.teacher?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const matchesType = subjectType === 'all' ||
                item.subject?.type?.toLowerCase() === subjectType.toLowerCase();

            return matchesSearch && matchesType;
        });
    }, [activeSubjectTeachers, searchTerm, subjectType]);

    return (
        <div className="flex flex-col h-full">
            <SidebarHeader className="flex-none p-3 border-b">
                <div className='flex justify-between w-full'>
                    <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <div className="text-lg font-semibold text-foreground">
                            Mata Pelajaran
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                                <Filter className="w-5 h-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => setSubjectType('all')}>
                                Semua
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSubjectType('theorical')}>
                                Teori
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSubjectType('practical')}>
                                Praktik
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <SidebarInput
                    placeholder="Cari mata pelajaran atau guru..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
                />
            </SidebarHeader>

            {/* Break Card - Fixed position */}
            <div className="flex-none border-b bg-orange-50/50 dark:bg-orange-900/10">
                <Droppable droppableId="break-area">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            <BreakCard />
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>

            {/* Scrollable Subject List */}
            <div className="flex-1 min-h-0 overflow-y-auto">
                <Droppable {...droppableProps}>
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {filteredSubjects.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`
                                                flex flex-col gap-1.5 p-3
                                                transition-all duration-200 ease-in-out
                                                border-b last:border-b-0
                                                cursor-move select-none
                                                hover:bg-accent hover:text-accent-foreground
                                                ${snapshot.isDragging ? 'bg-accent shadow-lg scale-[1.02]' : 'bg-card'}
                                            `}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="w-4 h-4 text-primary" />
                                                    <span className="font-medium">
                                                        {item.subject?.name || 'Unnamed Subject'}
                                                    </span>
                                                </div>
                                                <span className="px-2 py-0.5 text-[10px] text-nowrap font-medium bg-primary/10 text-primary rounded-full">
                                                    {item.subject?.code || 'No Code'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <GraduationCap className="w-3.5 h-3.5" />
                                                <span>{item.teacher?.name || 'Unnamed Teacher'}</span>
                                            </div>
                                            <div className="text-[11px] text-muted-foreground/80">
                                                {item.subject?.type ? (item.subject.type === 'theorical' ? 'Teori' : 'Praktik') : 'No Type'} • {item.subject?.name || 'No Subject'}
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </div>
    );
};
