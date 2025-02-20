import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { TeamSwitcher } from '@/components/layout/team-switcher'
import { SidebarData } from './data/sidebar-data'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const sidebarData = SidebarData()

    const authorizedNavigation = {
        ...sidebarData,
        navGroups: sidebarData.navGroups.map(group => ({
            ...group,
            items: group.items.filter(item => {
                if ('items' in item && item.items) {
                    // Filter sub-items dan simpan hasilnya
                    item.items = item.items.filter(subItem =>
                        subItem.visible !== false
                    )
                    return item.items.length > 0
                }
                return item.visible !== false
            })
        })).filter(group => group.items.length > 0)
    }

    return (
        <Sidebar collapsible='icon' variant='sidebar' {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={sidebarData.teams} />
            </SidebarHeader>
            <SidebarContent>
                {authorizedNavigation.navGroups.map((props) => (
                    <NavGroup key={props.title} {...props} />
                ))}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={sidebarData.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
