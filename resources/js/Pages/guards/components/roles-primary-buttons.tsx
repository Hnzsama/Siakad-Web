import { IconPlus, IconUpload } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useRoles } from '../context/roles-context'
import { RolesExportDropdown } from './roles-export-dropdown'
import { Role } from '../data/schema'

interface RolesPrimaryButtonsProps {
    data: Role[]
}

export function RolesPrimaryButtons({
    data
}: RolesPrimaryButtonsProps) {
    const { setOpen, permissions } = useRoles()
    return (
        <div className='flex gap-2'>
            <RolesExportDropdown data={data}/>
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
