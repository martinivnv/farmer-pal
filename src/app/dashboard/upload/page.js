"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function UploadPage() {
	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState(null);

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		setFile(selectedFile);

		if (selectedFile) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result);
			};
			reader.readAsDataURL(selectedFile);
		} else {
			setPreview(null);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Here you would typically send the file to your backend for processing
		console.log("File submitted:", file);
		// Reset the form
		setFile(null);
		setPreview(null);
	};

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
					<form onSubmit={handleSubmit}>
						<div className="grid w-full items-center gap-4">
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="image">Crop Image</Label>
								<Input
									id="image"
									type="file"
									accept="image/*"
									onChange={handleFileChange}
								/>
							</div>
							{preview && (
								<div className="mt-4">
									<img
										src={preview || "/placeholder.svg"}
										alt="Preview"
										className="max-w-full h-auto rounded-lg"
									/>
								</div>
							)}
						</div>
					</form>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button
						variant="outline"
						onClick={() => {
							setFile(null);
							setPreview(null);
						}}
					>
						Cancel
					</Button>
					<Button type="submit" onClick={handleSubmit} disabled={!file}>
						Submit for Diagnosis
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
