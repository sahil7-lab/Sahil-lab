import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


// ===============================
// FIREBASE CONFIG
// ===============================

const firebaseConfig = {
  apiKey: "AIzaSyC9rQiWEwvq8CmG5Jf-ozgNvBRyhb3Ex_4",
  authDomain: "sa7hil-58891.firebaseapp.com",
  projectId: "sa7hil-58891",
  storageBucket: "sa7hil-58891.firebasestorage.app",
  messagingSenderId: "587003472823",
  appId: "1:587003472823:web:659bd39c1b519788865632",
  measurementId: "G-4W9LY0MT4C"
};


// ===============================
// INITIALIZE FIREBASE
// ===============================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ===============================
// HELPER
// ===============================

function getElement(id) {
  return document.getElementById(id);
}


function showMessage(text, success = false) {

  const message = getElement("message");

  if (!message) return;

  message.textContent = text;

  message.style.color = success
    ? "#8fe6b4"
    : "#ff9b9b";
}


// ===============================
// LOGIN BUTTON
// ===============================

getElement("loginBtn")?.addEventListener("click", () => {

  getElement("login")?.scrollIntoView({
    behavior: "smooth"
  });

});


// ===============================
// EMAIL LOGIN
// ===============================

getElement("emailLogin")?.addEventListener("click", async () => {

  const email = getElement("email")?.value.trim();

  const password = getElement("password")?.value;


  if (!email || !password) {

    showMessage(
      "Please enter your email and password."
    );

    return;

  }


  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    showMessage(
      "Login successful!",
      true
    );

  } catch (error) {

    console.error("Login error:", error);

    showMessage(
      error.message
    );

  }

});


// ===============================
// CREATE ACCOUNT
// ===============================

getElement("signup")?.addEventListener("click", async () => {

  const email = getElement("email")?.value.trim();

  const password = getElement("password")?.value;


  if (!email || !password) {

    showMessage(
      "Please enter an email and password."
    );

    return;

  }


  if (password.length < 6) {

    showMessage(
      "Password must be at least 6 characters."
    );

    return;

  }


  try {

    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    showMessage(
      "Account created successfully!",
      true
    );

  } catch (error) {

    console.error("Signup error:", error);

    showMessage(
      error.message
    );

  }

});


// ===============================
// FORGOT PASSWORD
// ===============================

getElement("forgot")?.addEventListener("click", async () => {

  const email = getElement("email")?.value.trim();


  if (!email) {

    showMessage(
      "Enter your email first."
    );

    return;

  }


  try {

    await sendPasswordResetEmail(
      auth,
      email
    );

    showMessage(
      "Password reset email sent!",
      true
    );

  } catch (error) {

    console.error(
      "Password reset error:",
      error
    );

    showMessage(
      error.message
    );

  }

});


// ===============================
// PHONE OTP
// ===============================

let confirmationResult = null;


getElement("otp")?.addEventListener("click", async () => {

  const phone = getElement("phone")?.value.trim();


  if (!phone) {

    showMessage(
      "Enter your phone number with country code."
    );

    return;

  }


  try {

    // Create reCAPTCHA only once
    if (!window.recaptchaVerifier) {

      window.recaptchaVerifier =
        new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "normal"
          }
        );

      await window.recaptchaVerifier.render();

    }


    confirmationResult =
      await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      );


    getElement("otpCode")
      ?.classList.remove("hidden");

    getElement("verifyOtp")
      ?.classList.remove("hidden");


    showMessage(
      "OTP sent successfully. Enter the OTP.",
      true
    );


  } catch (error) {

    console.error(
      "Phone OTP error:",
      error
    );

    showMessage(
      error.message
    );


    // Reset reCAPTCHA after an error
    try {

      window.recaptchaVerifier?.clear();

    } catch (e) {

      console.error(
        "reCAPTCHA clear error:",
        e
      );

    }

    window.recaptchaVerifier = null;

  }

});


// ===============================
// VERIFY OTP
// ===============================

getElement("verifyOtp")?.addEventListener(
  "click",
  async () => {

    const code =
      getElement("otpCode")?.value.trim();


    if (!confirmationResult) {

      showMessage(
        "Please request an OTP first."
      );

      return;

    }


    if (!code) {

      showMessage(
        "Enter the OTP."
      );

      return;

    }


    try {

      await confirmationResult.confirm(
        code
      );

      showMessage(
        "Phone login successful!",
        true
      );

      confirmationResult = null;


    } catch (error) {

      console.error(
        "OTP verification error:",
        error
      );

      showMessage(
        error.message
      );

    }

  }
);


// ===============================
// START CAMPAIGN BUTTON
// ===============================

getElement("startCampaignBtn")
  ?.addEventListener("click", () => {

    getElement("campaign")
      ?.scrollIntoView({
        behavior: "smooth"
      });

  });


// ===============================
// LAUNCH CAMPAIGN
// ===============================

getElement("launchCampaignBtn")
  ?.addEventListener("click", async () => {

    const user = auth.currentUser;


    if (!user) {

      const campaignMessage =
        getElement("campaignMessage");

      if (campaignMessage) {

        campaignMessage.textContent =
          "Please login first.";

      }


      getElement("login")
        ?.scrollIntoView({
          behavior: "smooth"
        });

      return;

    }


    const name =
      getElement("campaignName")
        ?.value.trim();

    const goal =
      getElement("campaignGoal")
        ?.value.trim();

    const description =
      getElement("campaignDescription")
        ?.value.trim();

    const campaignMessage =
      getElement("campaignMessage");


    if (!name || !goal || !description) {

      if (campaignMessage) {

        campaignMessage.textContent =
          "Please fill all campaign fields.";

      }

      return;

    }


    try {

      await addDoc(
        collection(db, "campaigns"),
        {

          name: name,

          goal: goal,

          description: description,

          userId: user.uid,

          userEmail:
            user.email ||
            user.phoneNumber ||
            null,

          createdAt:
            serverTimestamp()

        }
      );


      if (campaignMessage) {

        campaignMessage.textContent =
          "Campaign created successfully!";

      }


      getElement("campaignName").value = "";

      getElement("campaignGoal").value = "";

      getElement("campaignDescription").value = "";


    } catch (error) {

      console.error(
        "Campaign error:",
        error
      );

      if (campaignMessage) {

        campaignMessage.textContent =
          error.message;

      }

    }

  });


// ===============================
// AUTH STATE
// ===============================

onAuthStateChanged(
  auth,
  (user) => {

    if (user) {

      console.log(
        "User logged in:",
        user.email ||
        user.phoneNumber
      );

    } else {

      console.log(
        "No user logged in."
      );

    }

  }
);


// ===============================
// LOGOUT FUNCTION
// ===============================

window.sa7hilLogout = async () => {

  try {

    await signOut(auth);

    showMessage(
      "Logged out successfully.",
      true
    );

  } catch (error) {

    console.error(
      "Logout error:",
      error
    );

    showMessage(
      error.message
    );

  }

};
