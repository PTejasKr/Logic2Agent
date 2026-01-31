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
                <div className="flex items-center gap-2 px-2">
                    {/* Replace with actual logo path if available or placeholder */}
                    <div className="bg-blue-600 p-1 rounded-md">
                        <Home className="text-white h-5 w-5" />
                    </div>
                    <span className="font-bold text-xl">Logic2Agent</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {MenuOptions.map((menu, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton asChild>
                                        <a href={menu.url}>
                                            <menu.icon />
                                            <span>{menu.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="mb-10">
                <div className="flex gap-2 items-center">
                    <Gem />
                    {open && <h2>Remaining Credits: <span className="font-bold">{userDetail?.token}</span></h2>}
                </div>
                {open && <Button className="w-full mt-3">Upgrade to Unlimited</Button>}
            </SidebarFooter>
        </Sidebar>
    )
}