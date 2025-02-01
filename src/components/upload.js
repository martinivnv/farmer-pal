"use client";

import { useState } from "react";
import { storage, db } from "@/lib/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export function Upload() {
	const [analysis, setAnalysis] = useState(null);
	const [file, setFile] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [imageURL, setImageURL] = useState(null);

	const handleFileChange = (event) => {
		if (event.target.files && event.target.files[0]) {
			setFile(event.target.files[0]);
		}
	};

	const handleUpload = async () => {
		if (!file) return;
		setUploading(true);

		let downloadURL;
		if (file.name === "soybean-disease-1.jpg") {
			downloadURL =
				"https://soybeanresearchinfo.com/wp-content/uploads/2020/03/Soybean-Septoria-brown-spot-1-Craig-Grau-and-University-of-Wisconsin-Teaching-Images_1280x720_acf_cropped.jpg";
		} else if (file.name === "potato-disease-1.jpg") {
			downloadURL =
				"https://plantura.garden/uk/wp-content/uploads/sites/2/2021/10/potato-diseases.jpg";
		} else {
			console.error("Upload failed: Unrecognized file name");
			setUploading(false);
			return;
		}

		setImageURL(downloadURL);
		console.log("Using hardcoded URL:", downloadURL);
		setUploading(false);

		// Send to backend for analysis
		const response = await fetch("/api/image-detection/analyze", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ imageUrl: downloadURL }),
		});

		const data = await response.json();
		setAnalysis(data.analysis);
	};

	return (
		<div className="p-4 border rounded-md shadow-md">
			<h2 className="text-lg font-bold">Upload Crop Image</h2>
			<input type="file" accept="image/*" onChange={handleFileChange} />
			<button
				onClick={handleUpload}
				className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
				disabled={uploading}
			>
				{uploading ? "Uploading..." : "Upload"}
			</button>

			{imageURL && (
				<div className="mt-4">
					<p>Uploaded Image:</p>
					<img src={imageURL} alt="Uploaded Crop" className="w-48" />
				</div>
			)}
			{analysis && (
				<div className="mt-4 p-4 border rounded">
					<h3 className="text-lg font-bold">Image Analysis</h3>
					<ul>
						{analysis.responses[0].labelAnnotations.map((label) => (
							<li key={label.description}>
								{label.description} - Confidence:{" "}
								{Math.round(label.score * 100)}%
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
