import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { MobileNav } from "@/components/mobile-nav";

export default function DashboardLayout({ children }) {
	return (
		<div className="flex flex-col min-h-screen">
			<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container flex h-14 items-center">
					<MainNav />
					<div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
						<div className="w-full flex-1 md:w-auto md:flex-none">
							{/* Add search functionality here if needed */}
						</div>
						<UserNav />
					</div>
				</div>
				<MobileNav />
			</header>
			<div className="flex-1 flex">
				<aside className="hidden md:flex md:w-64 md:flex-col">
					{/* Sidebar content */}
				</aside>
				<main className="flex-1 p-4">{children}</main>
			</div>
		</div>
	);
}
