"use client";

import {
	MapPin,
	Upload,
	BarChart,
	Settings,
	AlertTriangle,
	Moon,
	Sun,
} from "lucide-react";
import { useState } from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from "@/components/ui/sidebar";
import Image from "next/image";

const menuItems = [
	{
		title: "Map View",
		icon: MapPin,
		href: "/dashboard",
	},
	{
		title: "Upload Analysis",
		icon: Upload,
		href: "/dashboard/upload",
	},
	{
		title: "Alerts",
		icon: AlertTriangle,
		href: "/dashboard/alerts",
	},
	{
		title: "Analytics",
		icon: BarChart,
		href: "/dashboard/analytics",
	},
	{
		title: "Settings",
		icon: Settings,
		href: "/dashboard/settings",
	},
];

export function DashboardSidebar() {
	const [darkMode, setDarkMode] = useState(false);

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
		document.documentElement.classList.toggle("dark", !darkMode);
	};

	return (
		<Sidebar>
			<SidebarHeader className="border-b p-4">
				<div className="flex items-center justify-between gap-4">
					<div className="flex items-center gap-4">
						<Image
							src="/logo.png"
							alt="Logo"
							width={40}
							height={40}
							className="rounded-full border border-gray-300"
						/>
						<h2
							className={`text-lg font-semibold ${
								darkMode ? "text-[#e7e2c6]" : "text-[#2e402b]"
							}`}
						>
							FarmerPal
						</h2>{" "}
					</div>
					<button onClick={toggleDarkMode} className="p-2">
						{darkMode ? (
							<Sun className="h-5 w-5" />
						) : (
							<Moon className="h-5 w-5" />
						)}
					</button>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarMenu>
					{menuItems.map((item) => (
						<SidebarMenuItem key={item.href}>
							<SidebarMenuButton asChild className="text-md py-6 pl-4">
								<a href={item.href} className="flex items-center gap-2">
									<item.icon className="h-4 w-4" />
									<span>{item.title}</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarContent>
		</Sidebar>
	);
}
