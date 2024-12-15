import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../Firebase/Config"; // Ensure the Firebase config is correctly imported
import User from "../Services/User"; // Ensure the User model is imported

class AuthController {
  // Handle user signup
  static async handleSignup(email, password, profilePic, role, isVerified,payment,num,nom,prenom) {
    const user = new User(email, password, profilePic, isVerified,payment,role,num,nom,prenom);
    await user.signup();
  }

  // Handle user login
  static async handleLogin(email, password) {
    const user = new User(email, password);
    await user.login();
  }

  // Handle password reset (Forgot Password)
  static async handleForgotPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent.");
    } catch (error) {
      throw new Error("Error sending reset email: " + error.message);
    }
  }
}

export default AuthController;
