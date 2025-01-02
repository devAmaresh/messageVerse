"use client";

import { Form, Input, Button } from "antd";
import { Mail, Lock, LogIn, User } from "lucide-react";
import { HomeOutlined } from "@ant-design/icons";
import axios from "axios";
import backend_url from "@/utils/backend";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FloatIcon from "@/components/FloatIconToggle";
import { useState } from "react";
import Cookies from "js-cookie";
const RegisterPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");
  const onFinish = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      const res = await axios.post(`${backend_url}/api/auth/register`, values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 201) {
        Cookies.set("token", res.data.token);
        toast({
          title: "Success!",
          description: "You have successfully registered.",
        });
        router.push("/chat");
      }
    } catch (error: any) {
      /* eslint-disable */

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

  return (
    <div className="min-h-screen flex items-center justify-center">
      <FloatIcon />
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center gap-2">
          Welcome
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Please Register to continue
        </p>

        {/* Ant Design Form */}
        <Form
          name="registerForm"
          layout="vertical"
          onFinish={onFinish}
          className="space-y-4"
        >
          <Form.Item
            label="Full Name"
            name="name"
            rules={[
              { required: true, message: "Name is required" },
              { min: 3, message: "Name must be at least 3 characters" },
            ]}
          >
            <Input
              prefix={<User className="text-gray-500 w-5 h-5" />}
              placeholder="Enter your name"
              className="p-2"
            />
          </Form.Item>

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
            <Link href="/login">
              <p className="text-purple-600 hover:opacity-80">
                Already have an account? Login here
              </p>
            </Link>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full flex items-center justify-center gap-2"
              loading={loading}
              disabled={loading}
            >
              <LogIn className="w-5 h-5" />
              Register
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

export default RegisterPage;
