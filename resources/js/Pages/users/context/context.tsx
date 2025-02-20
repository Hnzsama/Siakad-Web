import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import pluralize from 'pluralize'
import { User } from '../data/schema'
import { permissionsName } from '@/types/app/permissionName'
import { generatePermissions } from '@/utils/generatePermission'

type DialogType = 'invite' | 'add' | 'edit' | 'delete'

interface ContextType {
    open: DialogType | null
    setOpen: (str: DialogType | null) => void
    currentRow: User | null
    setCurrentRow: React.Dispatch<React.SetStateAction<User | null>>
    permissions: permissionsName
}

const Context = React.createContext<ContextType | null>(null)

interface Props {
    children: React.ReactNode
}

export default function Provider({ children }: Props) {
    const [open, setOpen] = useDialogState<DialogType>(null)
    const [currentRow, setCurrentRow] = useState<User | null>(null)
    const permissions = generatePermissions('user')

    return (
        <Context.Provider value={{
            open,
            setOpen,
            currentRow,
            setCurrentRow,
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
