import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function MobileNav() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" size="icon" className="md:hidden">
					<Menu className="h-[1.2rem] w-[1.2rem]" />
					<span className="sr-only">Toggle menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left">
				<SheetHeader>
					<SheetTitle>Menu</SheetTitle>
					<SheetDescription>
						Navigate through the AgriHealth Dashboard
					</SheetDescription>
				</SheetHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Button className="col-span-4" variant="secondary" asChild>
							<a href="/dashboard">Home</a>
						</Button>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Button className="col-span-4" variant="secondary" asChild>
							<a href="/dashboard/upload">Upload & Diagnosis</a>
						</Button>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Button className="col-span-4" variant="secondary" asChild>
							<a href="/dashboard/community">Community</a>
						</Button>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Button className="col-span-4" variant="secondary" asChild>
							<a href="/dashboard/analytics">Analytics</a>
						</Button>
					</div>
				</div>
				<SheetFooter>
					<SheetClose asChild>
						<Button type="submit">Close</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
