import React from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
// import jwt_decode from "jwt-decode";
import axios from "axios";
import { postJSON } from "../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function GoogleAuth() {
    const navigate = useNavigate();
    const onSuccess = async (credentialResponse) => {
        try {
            // credentialResponse.credential is the Google ID token (JWT)
            const idToken = credentialResponse.credential;
            console.log("This is the google token", idToken);
            // send to backend
            const res = await postJSON("/auth/google", { idToken });
            //   console.log(res);
            const { token } = res;
            console.log("this is the token", token);
            localStorage.setItem("token", token);
            toast.success("Logged in Successfully");
            navigate('/');
            
        } catch (err) {
            console.error(err);
            alert("Google login failed");
        }
    };

    const onError = () => {
        alert("Google Login Failed");
    };

    return (
        <div>
            <GoogleLogin onSuccess={onSuccess} onError={onError} />
        </div>
    );
}
