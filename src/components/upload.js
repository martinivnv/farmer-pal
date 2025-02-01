"use client";

import { useState } from "react";
import { storage, db } from "@/lib/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const Upload = () => {
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

		const storageRef = ref(storage, `crop-images/${file.name}`);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			"state_changed",
			null,
			(error) => {
				console.error("Upload failed", error);
				setUploading(false);
			},
			async () => {
				const downloadURL = await getDownloadURL(storageRef);
				setImageURL(downloadURL);
				await addDoc(collection(db, "images"), {
					imageUrl: downloadURL,
					timestamp: serverTimestamp(),
				});

				console.log("Upload successful, image available at:", downloadURL);
				setUploading(false);

				// Send the uploaded image to backend for analysis
				await fetch("/api/analyze", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ imageUrl: downloadURL }),
				});
			}
		);
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
		</div>
	);
};

export default Upload;
