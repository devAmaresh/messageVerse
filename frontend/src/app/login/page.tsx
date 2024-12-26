"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Mail, Lock, LogIn } from "lucide-react";
import axios from "axios";
import backend_url from "@/utils/backend";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Spin } from "antd";
type FormValues = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();
  const { toast } = useToast();
  const router = useRouter();
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const res = await axios.post(`${backend_url}/api/auth/login`, data, {
        withCredentials: true,
      });
      if (res.status === 200) {
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

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center gap-2">
          <LogIn className="w-6 h-6 text-purple-600" />
          Welcome Back!
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Please login to continue
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
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
              <Lock className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
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
          <div>
            <Link href="/register">
              <p className="text-purple-600 hover:opacity-80">
                Don't have an account? Register here
              </p>
            </Link>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="disabled:cursor-not-allowed w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Spin spinning />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Login
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
