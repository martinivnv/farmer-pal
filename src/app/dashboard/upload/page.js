"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Upload } from "@/components/upload";

export default function UploadPage() {
	return (
		<div className="container mx-auto py-10">
			<Card className="w-full max-w-md mx-auto">
				<CardHeader>
					<CardTitle>Upload Image for Diagnosis</CardTitle>
					<CardDescription>
						Upload an image of your crop for AI-powered disease detection
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Upload />
				</CardContent>
			</Card>
		</div>
	);
}
