"use client";

import { Form, Input, Button } from "antd";
import { Mail, Lock, LogIn } from "lucide-react";
import { HomeOutlined } from "@ant-design/icons";
import axios from "axios";
import backend_url from "@/utils/backend";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FloatIcon from "@/components/FloatIconToggle";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
/* eslint-disable */
const LoginPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");
  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await axios.post(`${backend_url}/api/auth/login`, values, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        Cookies.set("token", res.data.token, {
          expires: 1,
        });
        toast({
          title: "Success!",
          description: "You have successfully logged in.",
        });
        router.push("/chat");
      } else {
        toast({
          title: "Uh oh! Something went wrong.",
          description: res.data.message || "Unexpected error occurred.",
        });
      }
    } catch (error: any) {
      console.error("Error registering:", error);
      toast({
        title: "Uh oh! Something went wrong.",
        description:
          (error as any).response?.data?.message ||
          "Unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (token) {
      router.replace("/chat");
    }
  }, [token]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <FloatIcon />
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center gap-2">
          Welcome Back!
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Please login to continue
        </p>

        {/* Ant Design Form */}
        <Form
          name="loginForm"
          layout="vertical"
          onFinish={onFinish}
          className="space-y-4"
        >
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Invalid email address" },
            ]}
          >
            <Input
              prefix={<Mail className="text-gray-500 w-5 h-5" />}
              placeholder="Enter your email"
              className="p-2"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password
              prefix={<Lock className="text-gray-500 w-5 h-5" />}
              placeholder="Enter your password"
              className="p-2"
            />
          </Form.Item>

          <div>
            <Link href="/register">
              <p className="text-purple-600 hover:opacity-80">
                Don&apos;t have an account? Register here
              </p>
            </Link>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full flex items-center justify-center gap-2"
              size="large"
              disabled={loading}
              loading={loading}
            >
              <LogIn className="w-5 h-5" />
              Login
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <Button
            type="text"
            icon={<HomeOutlined />}
            size="large"
            className="w-full"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
