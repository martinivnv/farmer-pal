import Link from "next/link";
import { cn } from "@/lib/utils";

export function MainNav({ className, ...props }) {
	return (
		<nav
			className={cn("flex items-center space-x-4 lg:space-x-6", className)}
			{...props}
		>
			<Link
				href="/dashboard"
				className="text-sm font-medium transition-colors hover:text-primary"
			>
				Home
			</Link>
			<Link
				href="/dashboard/upload"
				className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
			>
				Upload & Diagnosis
			</Link>
			<Link
				href="/dashboard/community"
				className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
			>
				Community
			</Link>
			<Link
				href="/dashboard/analytics"
				className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
			>
				Analytics
			</Link>
		</nav>
	);
}
