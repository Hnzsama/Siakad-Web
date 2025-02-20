import { IconMailPlus, IconPlus, IconUpload, IconUserPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useResourceContext } from '../context/context'
import { ExportDropdown } from './export-dropdown'
import { User } from '../data/schema'

interface PrimaryButtonsProps {
    data: User[]
}

export function PrimaryButtons({
    data
}: PrimaryButtonsProps) {
    const { setOpen, permissions } = useResourceContext()
    return (
        <div className='flex gap-2'>
            <ExportDropdown data={data} />
            <Button
                variant='outline'
                className='space-x-1'
                onClick={() => setOpen('invite')}   
            >
                <span>Invite User</span> <IconMailPlus size={18} />
            </Button>
            <Button className='space-x-1' onClick={() => setOpen('add')} hidden={!permissions.create}>
                <span>Add User</span> <IconUserPlus size={18} />
            </Button>
        </div>
    )
}
