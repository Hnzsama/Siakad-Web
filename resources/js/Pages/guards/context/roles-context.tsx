import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Role } from '../data/schema'
import { permissionsName } from '@/types/app/permissionName'
import { generatePermissions } from '@/utils/generatePermission'

type RolesDialogType = 'create' | 'update' | 'delete' | 'import'

interface RolesContextType {
    open: RolesDialogType | null
    setOpen: (str: RolesDialogType | null) => void
    currentRow: Role | null
    setCurrentRow: React.Dispatch<React.SetStateAction<Role | null>>
    resourceName: string
    permissions: permissionsName
}

const RolesContext = React.createContext<RolesContextType | null>(null)

interface Props {
    children: React.ReactNode
}

export default function RolesProvider({ children }: Props) {
    const resourceName = 'Peran'
    const [open, setOpen] = useDialogState<RolesDialogType>(null)
    const [currentRow, setCurrentRow] = useState<Role | null>(null)
    const permissions = generatePermissions('role')

    return (
        <RolesContext.Provider value={{
            open,
            setOpen,
            currentRow,
            setCurrentRow,
            resourceName,
            permissions
        }}
        >
            {children}
        </RolesContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRoles = () => {
    const rolesContext = React.useContext(RolesContext)

    if (!rolesContext) {
        throw new Error('useRoles has to be used within <rolesContext>')
    }

    return rolesContext
}
