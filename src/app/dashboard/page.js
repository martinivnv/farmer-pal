import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Bug, Leaf, Upload } from "lucide-react";
import { FarmMap } from "@/components/farm-map";
import { AlertsList } from "@/components/alerts-list";

export default function DashboardPage() {
	return (
		<div className="flex h-screen">
			<div className="flex-1 p-4">
				<div className="grid gap-4">
					{/* Quick Actions */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
						<Card className="bg-primary/10">
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-sm font-medium">
									Quick Upload
								</CardTitle>
								<Upload className="h-4 w-4 text-primary" />
							</CardHeader>
							<CardContent>
								<Button className="w-full" variant="outline">
									Analyze Image
								</Button>
							</CardContent>
						</Card>
						<Card className="bg-destructive/10">
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-sm font-medium">
									Active Alerts
								</CardTitle>
								<AlertTriangle className="h-4 w-4 text-destructive" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">5</div>
								<p className="text-xs text-muted-foreground">3 high priority</p>
							</CardContent>
						</Card>
						<Card className="bg-green-500/10">
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-sm font-medium">
									Crop Health
								</CardTitle>
								<Leaf className="h-4 w-4 text-green-500" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">Good</div>
								<p className="text-xs text-muted-foreground">
									92% healthy crops
								</p>
							</CardContent>
						</Card>
						<Card className="bg-yellow-500/10">
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-sm font-medium">
									Pest Activity
								</CardTitle>
								<Bug className="h-4 w-4 text-yellow-500" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">Low</div>
								<p className="text-xs text-muted-foreground">
									2 areas affected
								</p>
							</CardContent>
						</Card>
					</div>

					{/* Map */}
					<Card className="col-span-3 h-[600px]">
						<CardHeader>
							<CardTitle>Farm Overview</CardTitle>
						</CardHeader>
						<CardContent className="p-0">
							<FarmMap />
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Right Panel - Alerts */}
			<div className="w-96 border-l bg-muted/50 p-4">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold">Recent Alerts</h2>
					<Badge variant="outline">5 New</Badge>
				</div>
				<AlertsList />
			</div>
		</div>
	);
}
