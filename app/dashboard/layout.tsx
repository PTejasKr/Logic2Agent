import React from 'react'
import DashboardProvider from './Provider'
import AppHeader from './_components/AppHeader'
import { AppSidebar } from './_components/AppSidebar'
import { SidebarTrigger } from '@/components/ui/sidebar'

function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardProvider>
            <AppSidebar />
            <main className="w-full flex flex-col">
                <AppHeader />
                {children}
            </main>
        </DashboardProvider>
    )
}

export default DashboardLayout
