import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs, arrayUnion } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const db = getFirestore();
const storage = getStorage();

class Restaurant {
  constructor(name, address, phone, ownerId, RestoPic = null, locals = []) {
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.ownerId = ownerId;
    this.RestoPic = RestoPic;
    this.locals = locals; // Array of local IDs

    this.RestoPicURL = null;
    this.id = null;
  }

  // Add a new restaurant
  async addRestaurant() {
    try {
      if (this.locals.length > 6) {
        throw new Error("A restaurant cannot have more than 6 locals.");
      }
      

      const restaurantRef = doc(db, "restaurants", this.name);

      // Upload profile picture if provided
      if (this.RestoPic) {
        const RestoPicRef = ref(storage, `restaurant_pics/${this.name}`);
        await uploadBytes(RestoPicRef, this.RestoPic);
        this.RestoPicURL = await getDownloadURL(RestoPicRef);
      }

      await setDoc(restaurantRef, {
        name: this.name,
        address: this.address,
        phone: this.phone,
        ownerId: this.ownerId,
        RestoPic: this.RestoPicURL,
        locals: this.locals,
     
      });

      console.log("Restaurant added successfully!");
    } catch (error) {
      console.error("Error adding restaurant:", error.message);
      throw new Error(error.message);
    }
  }
  async updateUserVerification(userId) {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      isVerified: true,
    });
  }

  

  // Add a local to a restaurant
  static async addLocalToRestaurant(restaurantName, localId) {
    try {
      const restaurantRef = doc(db, "restaurants", restaurantName);
      const restaurantSnap = await getDoc(restaurantRef);

      if (!restaurantSnap.exists()) {
        throw new Error("Restaurant does not exist.");
      }

      const restaurantData = restaurantSnap.data();
      if (restaurantData.locals.length >= 6) {
        throw new Error("A restaurant cannot have more than 6 locals.");
      }

      await updateDoc(restaurantRef, {
        locals: arrayUnion(localId),
      });

      console.log("Local added to restaurant successfully!");
    } catch (error) {
      console.error("Error adding local to restaurant:", error.message);
      throw new Error(error.message);
    }
  }

  // Get restaurant details
  static async getRestaurant(name) {
    try {
      const restaurantRef = doc(db, "restaurants", name);
      const restaurantSnap = await getDoc(restaurantRef);

      if (!restaurantSnap.exists()) {
        throw new Error("Restaurant not found.");
      }

      return restaurantSnap.data();
    } catch (error) {
      console.error("Error retrieving restaurant:", error.message);
      throw new Error(error.message);
    }
  }

  // Delete restaurant
  static async deleteRestaurant(name) {
    try {
      const restaurantRef = doc(db, "restaurants", name);
      await deleteDoc(restaurantRef);
      console.log("Restaurant deleted successfully!");
    } catch (error) {
      console.error("Error deleting restaurant:", error.message);
      throw new Error(error.message);
    }
  }

  // Retrieve all workers linked to a restaurant
  static async getWorkers(restaurantId) {
    try {
      const workersQuery = query(collection(db, "workers"), where("restaurantId", "==", restaurantId));
      const querySnapshot = await getDocs(workersQuery);

      const workers = [];
      querySnapshot.forEach((doc) => {
        workers.push({ id: doc.id, ...doc.data() });
      });

      return workers;
    } catch (error) {
      console.error("Error retrieving workers:", error.message);
      throw new Error(error.message);
    }
  }

  // Update restaurant details
  static async updateRestaurant(name, updates) {
    try {
      const restaurantRef = doc(db, "restaurants", name);
      const restaurantSnap = await getDoc(restaurantRef);

      if (!restaurantSnap.exists()) {
        throw new Error("Restaurant does not exist.");
      }

      const existingData = restaurantSnap.data();

      // Merge existing data with updates
      const updatedData = {
        ...existingData,
        ...updates,
      };

      await updateDoc(restaurantRef, updatedData);

      console.log("Restaurant updated successfully!");
    } catch (error) {
      console.error("Error updating restaurant:", error.message);
      throw new Error(error.message);
    }
  }
}

export default Restaurant;
