"use client";

import {
	MapPin,
	Upload,
	BarChart,
	Settings,
	AlertTriangle,
} from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from "@/components/ui/sidebar";

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
	return (
		<Sidebar>
			<SidebarHeader className="border-b p-4">
				<h2 className="text-lg font-semibold">AgriHealth</h2>
			</SidebarHeader>
			<SidebarContent>
				<SidebarMenu>
					{menuItems.map((item) => (
						<SidebarMenuItem key={item.href}>
							<SidebarMenuButton asChild>
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
