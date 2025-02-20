import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconDownload } from "@tabler/icons-react"
import { Role } from "../data/schema"
import { useRoles } from "../context/roles-context"

type ExportableRole = Omit<Role, 'permissions' | 'selectedIds'>

interface RolesExportDropdownProps {
    data: Role[]
}

export function RolesExportDropdown({ data }: RolesExportDropdownProps) {
    const { permissions } = useRoles()

    const prepareDataForExport = (roles: Role[]): ExportableRole[] => {
        return roles.map(role => {
            const { permissions, selectedIds, ...exportableData } = role
            return exportableData
        })
    }

    const exportToCsv = () => {
        const exportData = prepareDataForExport(data)
        if (exportData.length === 0) return

        const headers = Object.keys(exportData[0]).map(key =>
            key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        )

        const csvRows = exportData.map(role =>
            Object.values(role).map(value =>
                value === null ? '' : String(value)
            ).join(',')
        )

        const csvContent = [headers.join(','), ...csvRows].join('\n')
        downloadFile(csvContent, 'roles.csv', 'text/csv')
    }

    const exportToExcel = () => {
        const exportData = prepareDataForExport(data)
        if (exportData.length === 0) return

        const headers = Object.keys(exportData[0]).map(key =>
            key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        )

        const excelRows = exportData.map(role =>
            Object.values(role).map(value =>
                value === null ? '' : String(value)
            ).join(',')
        )

        const excelContent = '\ufeff' + [headers.join(','), ...excelRows].join('\n')
        downloadFile(excelContent, 'roles.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    }

    const exportToSql = () => {
        const exportData = prepareDataForExport(data)
        if (exportData.length === 0) return

        const columns = Object.keys(exportData[0])

        const sqlStatements = exportData.map(role => {
            const values = Object.values(role).map(value => {
                if (value === null) return 'NULL'
                if (typeof value === 'number') return value
                return `'${String(value).replace(/'/g, "''")}'`
            })

            return `INSERT INTO roles (${columns.join(', ')}) VALUES (${values.join(', ')});`
        }).join('\n')

        downloadFile(sqlStatements, 'roles.sql', 'text/plain')
    }

    const downloadFile = (content: string, filename: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='outline'
                    className='space-x-1'
                    disabled={!permissions.export}
                >
                    <span>Ekspor</span> <IconDownload size={18} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ekspor sebagai</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={exportToCsv}>
                    CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToExcel}>
                    Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToSql}>
                    SQL
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
