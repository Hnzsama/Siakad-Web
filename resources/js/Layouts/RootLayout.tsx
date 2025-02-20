import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <SearchProvider>
            <SidebarProvider defaultOpen={true}>
                <div className="flex w-full min-h-screen">
                    {children}
                </div>
            </SidebarProvider>
        </SearchProvider>
    )
}
