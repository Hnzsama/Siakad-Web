import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import pluralize from 'pluralize'
import { School } from '../data/schema'
import { permissionsName } from '@/types/app/permissionName'
import { generatePermissions } from '@/utils/generatePermission'

type DialogType = 'create' | 'update' | 'delete' | 'import'

interface ContextType {
    open: DialogType | null
    setOpen: (str: DialogType | null) => void
    currentRow: School | null
    setCurrentRow: React.Dispatch<React.SetStateAction<School | null>>
    resourceName: string
    mainRoute: string
    permissions: permissionsName
}

const Context = React.createContext<ContextType | null>(null)

interface Props {
    children: React.ReactNode
}

export default function Provider({ children }: Props) {
    const resourceName = 'Sekolah'
    const mainRoute = 'schools'
    const [open, setOpen] = useDialogState<DialogType>(null)
    const [currentRow, setCurrentRow] = useState<School | null>(null)
    const singular = pluralize.singular(mainRoute)
    const permissions = generatePermissions(singular)

    return (
        <Context.Provider value={{
            open,
            setOpen,
            currentRow,
            setCurrentRow,
            resourceName,
            mainRoute,
            permissions
        }}
        >
            {children}
        </Context.Provider>
    )
}

export const useResourceContext = () => {
    const context = React.useContext(Context)

    if (!context) {
        throw new Error('useTasks has to be used within <context>')
    }

    return context
}
