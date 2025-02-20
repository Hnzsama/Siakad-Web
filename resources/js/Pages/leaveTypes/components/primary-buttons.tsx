import { IconPlus, IconUpload } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useResourceContext } from '../context/context'
import { ExportDropdown } from './export-dropdown'
import { LeaveType } from '../data/schema'

interface PrimaryButtonsProps {
    data: LeaveType[]
}

export function PrimaryButtons({
    data
}: PrimaryButtonsProps) {
    const { setOpen, permissions } = useResourceContext()
    return (
        <div className='flex gap-2'>
            <ExportDropdown data={data}/>
            {/* <Button
                variant='outline'
                className='space-x-1'
                onClick={() => setOpen('import')}
                hidden={!permissions.import}
            >
                <span>Impor</span> <IconUpload size={18} />
            </Button> */}
            <Button className='space-x-1' onClick={() => setOpen('create')} hidden={!permissions.create}>
                <span>Tambah</span> <IconPlus size={18} />
            </Button>
        </div>
    )
}
