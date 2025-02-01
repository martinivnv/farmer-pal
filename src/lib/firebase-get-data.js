import { db } from "./firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";

/**
 * Fetch pest analyses from Firestore
 * @param {Object} options - Optional configuration for query
 * @param {number} options.limit - Limit the number of results
 * @param {boolean} options.mostRecent - Sort by most recent first
 * @returns {Promise<Array>} Array of pest analyses
 */
export async function getPestAnalyses(options = {}) {
  try {
    const { limit: queryLimit = 100, mostRecent = true } = options;

    // Create a query against the "pest-analyses" collection
    const q = query(
      collection(db, "pest-analyses"),
      where("type", "==", "pest"),
      ...(mostRecent ? [orderBy("timestamp", "desc")] : []),
      limit(queryLimit)
    );

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Map the documents to an array of data
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching pest analyses:", error);
    throw error;
  }
}

/**
 * Fetch crop disease analyses from Firestore
 * @param {Object} options - Optional configuration for query
 * @param {number} options.limit - Limit the number of results
 * @param {boolean} options.mostRecent - Sort by most recent first
 * @returns {Promise<Array>} Array of crop disease analyses
 */
export async function getCropDiseaseAnalyses(options = {}) {
  try {
    const { limit: queryLimit = 100, mostRecent = true } = options;

    // Create a query against the "crop-analyses" collection
    const q = query(
      collection(db, "crop-analyses"),
      where("type", "==", "crop-disease"),
      ...(mostRecent ? [orderBy("timestamp", "desc")] : []),
      limit(queryLimit)
    );

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Map the documents to an array of data
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching crop disease analyses:", error);
    throw error;
  }
}

/**
 * Fetch crop location plans from Firestore
 * @param {Object} options - Optional configuration for query
 * @param {number} options.limit - Limit the number of results
 * @param {boolean} options.mostRecent - Sort by most recent first
 * @returns {Promise<Array>} Array of crop location plans
 */
export async function getCropLocationPlans(options = {}) {
  try {
    const { limit: queryLimit = 100, mostRecent = true } = options;

    // Create a query against the "crop-locations" collection
    const q = query(
      collection(db, "crop-locations"),
      where("type", "==", "location-plan"),
      ...(mostRecent ? [orderBy("timestamp", "desc")] : []),
      limit(queryLimit)
    );

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Map the documents to an array of data
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching crop location plans:", error);
    throw error;
  }
}

/**
 * Get a specific document by its ID and collection type
 * @param {string} id - Document ID
 * @param {string} collectionType - Type of collection ('pest-analyses', 'crop-analyses', or 'crop-locations')
 * @returns {Promise<Object>} Document data
 */
export async function getDocumentById(id, collectionType) {
  try {
    const docRef = doc(db, collectionType, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } else {
      throw new Error("No such document exists");
    }
  } catch (error) {
    console.error(`Error fetching document from ${collectionType}:`, error);
    throw error;
  }
}
