import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

const alerts = [
	{
		id: 1,
		title: "Pest Outbreak Detected",
		description: "Corn field sector A-3 shows signs of corn rootworm activity",
		type: "pest",
		priority: "high",
		time: "10 minutes ago",
	},
	{
		id: 2,
		title: "Disease Risk Alert",
		description:
			"High risk of wheat rust in northern sectors due to weather conditions",
		type: "disease",
		priority: "medium",
		time: "1 hour ago",
	},
	{
		id: 3,
		title: "Crop Health Warning",
		description: "Nutrient deficiency detected in soybean field B-2",
		type: "health",
		priority: "low",
		time: "2 hours ago",
	},
];

export function AlertsList() {
	return (
		<div className="mt-4 space-y-4">
			{alerts.map((alert) => (
				<Alert
					key={alert.id}
					variant={alert.priority === "high" ? "destructive" : "default"}
					className="border-l-4"
				>
					<AlertTriangle className="h-4 w-4" />
					<AlertTitle className="flex items-center gap-2">
						{alert.title}
						<Badge
							variant={
								alert.priority === "high"
									? "destructive"
									: alert.priority === "medium"
									? "warning"
									: "secondary"
							}
						>
							{alert.priority}
						</Badge>
					</AlertTitle>
					<AlertDescription className="mt-2">
						<p>{alert.description}</p>
						<p className="mt-2 text-xs text-muted-foreground">{alert.time}</p>
					</AlertDescription>
				</Alert>
			))}
		</div>
	);
}
