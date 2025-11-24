import React, { useState } from "react";
import { firebaseAuth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import axios from "axios";

export default function PhoneAuth() {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [confirmation, setConfirmation] = useState(null);

    const setupRecaptcha = () => {
        if (window.recaptchaVerifier) return window.recaptchaVerifier;
        // window.recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", {
        //     size: "invisible",
        //     callback: (response) => {
        //         // recaptcha solved
        //     },
        // }, firebaseAuth);
       


        window.recaptchaVerifier = new RecaptchaVerifier(
            firebaseAuth,
            "recaptcha-container",
            {
                size: "invisible",
            }
        );


        
        return window.recaptchaVerifier;
    };

    const sendOtp = async () => {
        try {
            const verifier = setupRecaptcha();
            const result = await signInWithPhoneNumber(firebaseAuth, phone, verifier);
            setConfirmation(result);
            alert("OTP sent");
        } catch (err) {
            console.error(err);
            alert("Failed to send OTP: " + err.message);
        }
    };

    const verifyOtp = async () => {
        try {
            const res = await confirmation.confirm(otp);
            const idToken = await res.user.getIdToken();

            // send this idToken to backend to get app JWT
            const backendResp = await axios.post("/auth/firebase-login", { token: idToken });
            const { token } = backendResp.data;
            localStorage.setItem("token", token);
            alert("Logged in");
        } catch (err) {
            console.error(err);
            alert("Invalid OTP or error: " + err.message);
        }
    };

    return (
        <div>
            <div id="recaptcha-container"></div>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91XXXXXXXXXX" />
            <button onClick={sendOtp}>Send OTP</button>

            <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" />
            <button onClick={verifyOtp}>Verify OTP</button>
        </div>
    );
}
