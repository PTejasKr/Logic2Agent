import React from 'react'
import DashboardProvider from './Provider'
import AppHeader from './_components/AppHeader'
import AppFooter from './_components/AppFooter'
import { AppSidebar } from './_components/AppSidebar'
import { SidebarInset } from '@/components/ui/sidebar'

function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardProvider>
            <div className="flex min-h-screen w-full">
                <AppSidebar />
                <SidebarInset>
                    <AppHeader />
                    <main className="p-0">
                        {children}
                    </main>
                    <AppFooter />
                </SidebarInset>
            </div>
        </DashboardProvider>
    )
}

export default DashboardLayout
