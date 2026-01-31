import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React from 'react'

function AppHeader() {
    return (
        <header className="flex justify-between items-center w-full p-5 shadow-md border-b bg-white dark:bg-gray-900">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="h-12 w-12 p-3" />
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <UserButton afterSignOutUrl="/" />
        </header>
    )
}

export default AppHeader
