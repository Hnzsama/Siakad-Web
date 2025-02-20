import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from 'react'

interface Tab {
    value: string
    label: string
    content: React.ReactNode
}

interface ContentSectionProps {
    title: string
    desc: string
    children?: React.ReactNode
    tabs?: Tab[]
    defaultTab?: string
}

export default function ContentSection({
    title,
    desc,
    children,
    tabs,
    defaultTab,
}: ContentSectionProps) {
    const [activeTab, setActiveTab] = useState(defaultTab ?? tabs?.[0]?.value)

    return (
        <div className="flex flex-col h-full">
            {tabs ? (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
                    <div className="flex-none space-y-1.5">
                        <h3 className="text-lg font-medium">{title}</h3>
                        <p className="text-sm text-muted-foreground">{desc}</p>
                        <TabsList className="grid w-full mt-4" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
                            {tabs.map(tab => (
                                <TabsTrigger key={tab.value} value={tab.value}>
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex-1 min-h-0"> {/* Add this wrapper with min-h-0 */}
                        <ScrollArea className="w-full h-full pr-4 -mr-4">
                            <div className="pb-4 px-0.5"> {/* Remove max-w-2xl */}
                                {tabs.map(tab => (
                                    <TabsContent key={tab.value} value={tab.value} className="m-0 mt-0">
                                        {tab.content}
                                    </TabsContent>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </Tabs>
            ) : (
                <>
                    <div className="flex-none space-y-1.5">
                        <h3 className="text-lg font-medium">{title}</h3>
                        <p className="text-sm text-muted-foreground">{desc}</p>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex-1 min-h-0"> {/* Add this wrapper with min-h-0 */}
                        <ScrollArea className="w-full h-full pr-4 -mr-4">
                            <div className="pb-4 px-0.5">
                                {children}
                            </div>
                        </ScrollArea>
                    </div>
                </>
            )}
        </div>
    )
}
