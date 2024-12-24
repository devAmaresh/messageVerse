"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Mail, Lock, LogIn, User } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import backend_url from "@/utils/backend";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
type FormValues = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const { toast } = useToast();
  const router = useRouter();
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const res = await axios.post(`${backend_url}/api/auth/register`, data);
      if (res.status === 201) {
        toast({
          title: "Success!",
          description: "You have successfully logged in.",
        });
        router.push("/chat");
      }
    } catch (error: any) {
      console.error("Error logging in:", error);
      toast({
        title: "Uh oh! Something went wrong.",
        description: error.response.data.message,
      });
    }
  };

  const handleGoogleLogin = () => {
    console.log("Logging in with Google");
    // Add Google login logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center gap-2">
          Welcome
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Please Register to continue
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                })}
                className={`w-full pl-10 p-2 border-2 rounded-md focus:outline-none bg-white ${
                  errors.name
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-purple-500"
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full pl-10 p-2 border-2 rounded-md focus:outline-none bg-white ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-purple-500"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`w-full pl-10 p-2 border-2 bg-white rounded-md focus:outline-none ${
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-purple-500"
                }`}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Login
          </button>
        </form>

        <div className="flex items-center justify-center mt-6">
          <span className="text-sm text-gray-600">OR</span>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center bg-red-500 text-white py-2 rounded-md mt-4 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 gap-2"
        >
          <FcGoogle />
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
