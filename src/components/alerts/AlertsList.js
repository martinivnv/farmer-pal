import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Bug,
  Calendar,
  Cloud,
  History,
  Users,
  MessageSquare,
  Thermometer,
} from "lucide-react";

// Alert data array remains the same
const allAlerts = [
  {
    id: 1,
    type: "pest",
    severity: "high",
    title: "Pest Outbreak Detected",
    description: "Corn field sector A-3 shows signs of corn rootworm activity",
    timestamp: "10 minutes ago",
    icon: Bug,
  },
  {
    id: 2,
    type: "disease",
    severity: "medium",
    title: "Disease Risk Alert",
    description:
      "High risk of wheat rust in northern sectors due to weather conditions",
    timestamp: "1 hour ago",
    icon: AlertTriangle,
  },
  {
    id: 3,
    type: "health",
    severity: "low",
    title: "Crop Health Warning",
    description: "Nutrient deficiency detected in soybean field B-2",
    timestamp: "2 hours ago",
    icon: AlertTriangle,
  },
  {
    id: 4,
    type: "community",
    title: "Nearby Farm Report",
    description: "Fall armyworm spotted in neighboring farm (2km South)",
    timestamp: "30 minutes ago",
    icon: Users,
  },
  {
    id: 5,
    type: "community",
    title: "Regional Alert",
    description: "Multiple reports of aphid infestations in district",
    timestamp: "1 day ago",
    icon: MessageSquare,
  },
  {
    id: 6,
    type: "prediction",
    title: "Pest Cycle Alert",
    description:
      "Historical data suggests high risk of grasshopper activity in next 2 weeks",
    timestamp: "Future",
    icon: History,
  },
  {
    id: 7,
    type: "prediction",
    title: "Disease Risk Forecast",
    description: "Upcoming weather conditions favorable for fungal diseases",
    timestamp: "Future",
    icon: Calendar,
  },
  {
    id: 8,
    type: "weather",
    title: "Weather Warning",
    description:
      "Heavy rainfall expected in next 48 hours - Consider adjusting irrigation",
    timestamp: "2 hours ago",
    icon: Cloud,
  },
  {
    id: 9,
    type: "weather",
    title: "Temperature Alert",
    description: "Heat stress risk: Temperatures expected to exceed 35°C",
    timestamp: "1 hour ago",
    icon: Thermometer,
  },
];

const getSeverityColor = (severity) => {
  switch (severity) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-yellow-500";
    case "low":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

const AlertCard = ({ alert }) => (
  <Card key={alert.id} className="relative">
    {alert.severity && (
      <div
        className={`absolute left-0 top-0 w-1 h-full ${getSeverityColor(
          alert.severity
        )}`}
      />
    )}
    <CardHeader className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {alert.icon && (
            <alert.icon className="h-4 w-4 text-muted-foreground" />
          )}
          <CardTitle className="text-sm font-medium">{alert.title}</CardTitle>
        </div>
        {alert.severity && (
          <Badge
            variant="outline"
            className={`${getSeverityColor(alert.severity)} text-white`}
          >
            {alert.severity}
          </Badge>
        )}
      </div>
      <CardDescription className="mt-1">{alert.description}</CardDescription>
    </CardHeader>
    <CardContent className="p-4 pt-0">
      <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
    </CardContent>
  </Card>
);

const tabItems = [
  { value: "current", label: "Current", icon: AlertTriangle },
  { value: "community", label: "Community", icon: Users },
  { value: "prediction", label: "Predictions", icon: History }, // Changed value to match alert type
  { value: "weather", label: "Weather", icon: Cloud },
];

export function AlertsList() {
  const getFilteredAlerts = (filter) => {
    switch (filter) {
      case "current":
        return allAlerts.filter((alert) =>
          ["pest", "disease", "health"].includes(alert.type)
        );
      case "community":
        return allAlerts.filter((alert) => alert.type === "community");
      case "prediction": // Changed to match alert type
        return allAlerts.filter((alert) => alert.type === "prediction");
      case "weather":
        return allAlerts.filter((alert) => alert.type === "weather");
      default:
        return allAlerts;
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-4 gap-4 bg-muted p-1 rounded-lg">
          {tabItems.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2 data-[state=active]:bg-background"
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabItems.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="mt-6 space-y-4"
          >
            <div className="space-y-3">
              {getFilteredAlerts(tab.value).map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </TabsContent>
        ))}

        <div className="mt-4">
          <Button className="w-full" variant="outline">
            View All Alerts
          </Button>
        </div>
      </Tabs>
    </div>
  );
}

export default AlertsList;
