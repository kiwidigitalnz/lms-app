import * as React from "react"
import { useIsMobile } from "@/hooks/use-mobile"

export type SidebarState = "expanded" | "collapsed"

type SidebarContext = {
  state: SidebarState
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
  expandSidebar: () => void
  collapseSidebar: () => void
}

export const SidebarContext = React.createContext<SidebarContext | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<SidebarState>("expanded")
  const [open, setOpen] = React.useState(false)
  const [openMobile, setOpenMobile] = React.useState(false)
  const isMobile = useIsMobile()

  const toggleSidebar = React.useCallback(() => {
    setState((prev) => (prev === "expanded" ? "collapsed" : "expanded"))
  }, [])

  const expandSidebar = React.useCallback(() => {
    setState("expanded")
  }, [])

  const collapseSidebar = React.useCallback(() => {
    setState("collapsed")
  }, [])

  const value = React.useMemo(
    () => ({
      state,
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar,
      expandSidebar,
      collapseSidebar,
    }),
    [state, open, openMobile, isMobile, toggleSidebar, expandSidebar, collapseSidebar]
  )

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}