import { IconPlus, IconUpload } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useResourceContext } from '../context/context'
import { ExportDropdown } from './export-dropdown'
import { ClassSubject } from '../data/schema'
import { router } from '@inertiajs/react'
import { Classroom } from '@/Pages/classrooms/data/schema'

interface PrimaryButtonsProps {
    data: ClassSubject[]
    classrooms: Classroom[]
}

export function PrimaryButtons({
    data,
    classrooms
}: PrimaryButtonsProps) {
    // Get classroomId from first item in data array
    const classroomId = classrooms[0]?.id

    function handleNavigate() {
        if (classroomId) {
            router.get(route('classSubjects.edit', {
                id: classroomId,
            }));
        }
    }

    const { setOpen, permissions } = useResourceContext()
    return (
        <div className='flex gap-2'>
            {/* <ExportDropdown data={data} />
            <Button
                variant='outline'
                className='space-x-1'
                onClick={() => setOpen('import')}
                hidden={!permissions.import}
            >
                <span>Impor</span> <IconUpload size={18} />
            </Button> */}
            <Button className='space-x-1' hidden={!classrooms || !permissions.create} onClick={handleNavigate}>
                <span>Tambah</span> <IconPlus size={18} />
            </Button>
        </div>
    )
}

