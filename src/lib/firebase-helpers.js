// lib/firebase-helpers.js
import { db } from "./firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function saveCropAnalysis(data) {
  try {
    const docRef = await addDoc(collection(db, "crop-analyses"), {
      ...data,
      timestamp: serverTimestamp(),
      type: "crop-disease",
    });
    console.log("Crop analysis saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving crop analysis:", error);
    throw error;
  }
}

export async function savePestAnalysis(data) {
  try {
    const docRef = await addDoc(collection(db, "pest-analyses"), {
      ...data,
      timestamp: serverTimestamp(),
      type: "pest",
    });
    console.log("Pest analysis saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving pest analysis:", error);
    throw error;
  }
}

export async function saveCropLocationPlan(data) {
  try {
    const docRef = await addDoc(collection(db, "crop-locations"), {
      ...data,
      timestamp: serverTimestamp(),
      type: "location-plan",
    });
    console.log("Crop location plan saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving crop location plan:", error);
    throw error;
  }
}

// Helper to sanitize data before saving to Firestore
export function sanitizeData(data) {
  if (!data) return data;

  const sanitized = { ...data };

  // Convert Date objects to timestamps
  Object.keys(sanitized).forEach((key) => {
    if (sanitized[key] instanceof Date) {
      sanitized[key] = sanitized[key].toISOString();
    } else if (typeof sanitized[key] === "object") {
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  });

  return sanitized;
}
