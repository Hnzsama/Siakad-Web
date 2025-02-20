import React, { createContext, useContext, useState } from 'react'

type SubjectListSidebarContextType = {
  isOpen: boolean
  toggle: () => void
  setOpen: (open: boolean) => void
}

const SubjectListSidebarContext = createContext<SubjectListSidebarContextType | undefined>(undefined)

export function SubjectListSidebarProvider({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <SubjectListSidebarContext.Provider
      value={{
        isOpen,
        toggle: () => setIsOpen((prev) => !prev),
        setOpen: setIsOpen,
      }}
    >
      {children}
    </SubjectListSidebarContext.Provider>
  )
}

export function useSubjectListSidebar() {
  const context = useContext(SubjectListSidebarContext)
  if (!context) {
    throw new Error('useSubjectListSidebar must be used within a SubjectListSidebarProvider')
  }
  return context
}
