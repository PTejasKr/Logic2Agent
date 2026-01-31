"use client"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { LayoutDashboard, Headphones, Database, WalletCards, Home, Gem } from "lucide-react"
import { useContext } from "react"
import { UserDetailContext } from "@/context/UserDetailContext"
import { Button } from "@/components/ui/button"

const MenuOptions = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard
    },
    {
        title: 'AI Agents',
        url: '#',
        icon: Headphones
    },
    {
        title: 'Data',
        url: '#',
        icon: Database
    },
    {
        title: 'Pricing',
        url: '#',
        icon: WalletCards
    },
]

export function AppSidebar() {
    const { userDetail } = useContext(UserDetailContext);
    const { open } = useSidebar();

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-4 p-4">
                    <div className="bg-blue-600 p-3 rounded-xl">
                        <Home className="text-white h-7 w-7" />
                    </div>
                    <span className={`font-bold ${open ? 'text-2xl' : 'hidden'} transition-all duration-200 ease-in-out`}>Logic2Agent</span>
                </div>
            </SidebarHeader>
            <SidebarContent className="mt-6">
                <SidebarGroup>
                    <SidebarGroupLabel className={`${open ? 'text-2xl' : 'hidden'} py-4 transition-all duration-200 ease-in-out font-bold`}>Application</SidebarGroupLabel>
                    <SidebarGroupContent className="mt-3">
                        <SidebarMenu>
                            {MenuOptions.map((menu, index) => (
                                <SidebarMenuItem key={index} className="mb-3">
                                    <SidebarMenuButton asChild className="py-5 px-4 rounded-xl h-14">
                                        <a href={menu.url}>
                                            <menu.icon className="h-7 w-7" />
                                            <span className={`${open ? 'text-xl' : 'hidden'} font-semibold transition-all duration-200 ease-in-out`}>{menu.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="mb-8">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <Gem className="h-6 w-6" />
                        {open && <h2 className="text-lg">Remaining Credits: <span className="font-bold">{userDetail?.token}</span></h2>}
                    </div>
                    {open && <Button className="w-full mt-4 py-6 text-lg rounded-lg">Upgrade to Unlimited</Button>}
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}