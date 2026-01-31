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
import Link from "next/link"
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
    const { open, isMobile } = useSidebar();

    return (
        <Sidebar collapsible={isMobile ? "offcanvas" : "none"} className="border-r border-white/5 bg-black/70 backdrop-blur-md md:h-svh md:sticky md:top-0">
            <SidebarHeader>
                <Link href="/" className="flex items-center gap-4 p-5 group cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="bg-primary/10 border border-primary/20 p-2.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-shadow">
                        <Home className="text-primary h-6 w-6 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className={`font-black tracking-tight ${open ? 'text-2xl' : 'hidden'} transition-all duration-200 ease-in-out`}>
                        <span className="text-blue-500">Dashboard</span>

                    </span>
                </Link>
            </SidebarHeader>
            <SidebarContent className="mt-4 px-2">
                <SidebarGroup>
                    <SidebarGroupLabel className={`${open ? 'text-[10px]' : 'hidden'} py-4 px-3 mb-2 transition-all duration-200 ease-in-out font-bold text-gray-500 uppercase tracking-[0.2em]`}>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {MenuOptions.map((menu, index) => (
                                <SidebarMenuItem key={index} className="mb-2">
                                    <SidebarMenuButton asChild className="py-6 px-4 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all group">
                                        <a href={menu.url} className="flex items-center gap-4">
                                            <menu.icon className="h-6 w-6 group-hover:scale-110 transition-transform group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
                                            <span className={`${open ? 'text-lg' : 'hidden'} font-semibold transition-all duration-200 ease-in-out`}>{menu.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-6 mb-4 mt-auto">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 px-2">
                        <div className="bg-accent/10 border border-accent/20 p-2 rounded-lg">
                            <Gem className="h-5 w-5 text-accent" />
                        </div>
                        {open && (
                            <div>
                                <h2 className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Credits</h2>
                                <p className="text-xl font-black text-white">{userDetail?.token}</p>
                            </div>
                        )}
                    </div>
                    {open && (
                        <Button className="w-full py-6 text-base font-bold rounded-2xl bg-primary hover:bg-primary/90 text-white transition-all shadow-[0_10px_30px_rgba(6,182,212,0.2)] hover:shadow-primary/40 active:scale-95">
                            Upgrade Now
                        </Button>
                    )}
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}