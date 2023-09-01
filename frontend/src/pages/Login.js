import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";

const Login = ({ setIsLoggedin }) => {
  const navigate = useNavigate();
  const goToRegister = () => {
    navigate("/register");
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
      const json = await response.json();
      console.log(json);
      if (json.success) {
        // Save the auth token and redirect
        localStorage.setItem("authtoken", json.authtoken);
        setIsLoggedin(true);
        navigate("/dashboard");
        toast.success("Successfully logged in.");
        
      } else {
        toast.error("Invalid email or password.");
      }
    },
  });

  const handleGoogleLogin = async (response) => {
    const tokenId = response.tokenId;
    const res = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: response.profileObj.email,
        isGoogleLogin: true,
        tokenId: tokenId,
      }),
    });
    const json = await res.json();
    console.log(json);
    if (json.success) {
      // Save the auth token and redirect
      localStorage.setItem("authtoken", json.authtoken);
      setIsLoggedin(true);
      navigate("/dashboard");
    } else {
      // Handle error
    }
  };

  const clientId =
    "407382736203-6eo5jv128nqcprqimck6mh1hf1r1a9.apps.googleusercontent.com";

  return (
    <>
      <div className="flex justify-center items-center p-24 bg-green">
     <Header/>
      <div className="cards p-8 lg:w-1/2 mx-auto bg-white rounded-md shadow-lg">
       
      
          <div className=" rounded-b-lg py-12 px-4 lg:px-24">
            <p className="text-center text-xl text-gray-500 font-light">
              Sign in with credentials
            </p>
            <form className="mt-6" onSubmit={formik.handleSubmit}>
              <div className="relative">
                <input
                  className="appearance-none border pl-12 border-gray-100 shadow-sm focus:shadow-md focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-gray-600 leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
                  id="email"
                  type="email"
                 placeholder="Email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500">{formik.errors.email}</div>
                )}
                <div className="absolute left-0 inset-y-0 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 ml-3 text-gray-400 p-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
              </div>
              <div className="relative mt-3">
                <input
                  className="appearance-none border pl-12 border-gray-100 shadow-sm focus:shadow-md focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-gray-600 leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500">{formik.errors.password}</div>
                )}
                <div className="absolute left-0 inset-y-0 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 ml-3 text-gray-400 p-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center justify-center mt-8">
                <button
                  className={`text-white py-2 px-4 uppercase rounded ${
                    formik.isSubmitting || !formik.isValid
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-500 hover:bg-indigo-600 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                  }`}
                  type="submit"
                  disabled={formik.isSubmitting || !formik.isValid}
                >
                  Sign In
                </button>
              </div>
              <div className="flex items-center justify-center mt-4">
                <GoogleLogin
                  clientId={clientId}
                  buttonText="Login with Google"
                  onSuccess={formik.isSubmitting ? null : handleGoogleLogin}
                  onFailure={formik.isSubmitting ? null : handleGoogleLogin}
                  cookiePolicy={"single_host_origin"}
                />
              </div>
              <span className="flex justify-center mt-2">
                Don't have an account?
              </span>
              <div className="flex items-center justify-center mt-2">
                <button
                  onClick={goToRegister}
                  className="text-white py-2 px-4 uppercase rounded bg-indigo-500 hover:bg-indigo-600 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                >
                  Sign up
                </button>
              </div>
            </form>
         
        </div>
      </div>
      <div />
      <div />
      </div>
    </>
  );
};

export default Login;
