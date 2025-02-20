import React from "react"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useSubjectListSidebar } from "@/context/subject-list-sidebar-context"
import { cn } from "@/lib/utils"

export function SubjectListSidebarTrigger({
  className,
}: React.HTMLAttributes<HTMLButtonElement>) {
  const { toggle } = useSubjectListSidebar()

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-9 w-9", className)}
      onClick={toggle}
    >
      <Menu className="h-4 w-4" />
    </Button>
  )
}
