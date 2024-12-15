import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../Firebase/Config";

const db = getFirestore();
const storage = getStorage();

class User {
  constructor(email, password, role, num, nom,prenom, isVerified,payment, profilePic = null) {
    this.email = email;
    this.password = password;
    this.role = role;
    this.profilePic = profilePic;
    this.nom = nom;
    this.prenom = prenom;
    this.num = num ;
    this.isVerified = isVerified;
    this.payment = payment;
 
    this.profilePicURL = null;
    this.uid = null;
  }

  // Sign up new user with additional bio and role
  async signup() {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
      this.uid = userCredential.user.uid; // Ensure we get the correct UID
  
      // If the user uploaded a profile picture
      if (this.profilePic) {
        const profilePicRef = ref(storage, `profile_pics/${this.uid}`);
        await uploadBytes(profilePicRef, this.profilePic); // Upload the profile pic
        this.profilePicURL = await getDownloadURL(profilePicRef); // Get the URL for the profile pic
      }
  
      // After the user is created, save their data to Firestore
      await this.saveUserToFirestore();
      console.log("User signed up successfully!");
    } catch (error) {
      console.error("Error during signup:", error.message);
      throw new Error(error.message);
    }
  }
  
  // Save user data to Firestore
  async saveUserToFirestore() {
    try {
      const userRef = doc(db, "users", this.uid); // Ensure we are using the correct UID
      await setDoc(userRef, {
        email: this.email,
      
        role: "admin",  
        isVerified : false ,
        payment : "Gratuit",
        nom: this.nom,    // Add role
        prenom: this.prenom,  
        num: this.num,


        profilePic: this.profilePicURL, // Add profilePicURL
      });
      console.log("User data saved to Firestore.");
    } catch (error) {
      console.error("Error saving user data to Firestore:", error.message);
    }
  }

  // Static method to retrieve user data from Firestore
  static async getUserData(uid) {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data();
      } else {
        console.log("No such user!");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving user data:", error.message);
    }
  }

  // Forgot password: Send password reset email
  static async forgotPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent!");
      alert("Password reset email sent. Please check your inbox.");
    } catch (error) {
      console.error("Error sending password reset email:", error.message);
      alert("Error: " + error.message);
    }
  }

  // Login user using email and password
  async login() {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
      this.uid = userCredential.user.uid; // Ensure we get the correct UID after login
      console.log("User logged in successfully!");
    } catch (error) {
      console.error("Error during login:", error.message);
      throw new Error(error.message);
    }
  }

  // Logout user
  static async logout() {
    try {
      await signOut(auth);
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error during logout:", error.message);
      throw new Error(error.message);
    }
  }
}

export default User;
