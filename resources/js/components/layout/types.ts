import { InertiaLinkProps as LinkProps } from "@inertiajs/react"

interface User {
    name: string
    email: string
    avatar_url: string
}

interface Team {
    name: string
    logo: React.ElementType
    plan: string
}

interface BaseNavItem {
    title: string
    badge?: string
    icon?: React.ElementType
    visible?: boolean
}

type NavLink = BaseNavItem & {
    url: LinkProps['href']
    items?: never
}

type NavCollapsible = BaseNavItem & {
    items: (BaseNavItem & { url: LinkProps['href'] })[]
    url?: never
}

type NavItem = NavCollapsible | NavLink

interface NavGroup {
    title: string
    items: NavItem[]
    visible?: boolean
}

interface SidebarData {
    user: User
    teams: Team[]
    navGroups: NavGroup[]
}

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink }
