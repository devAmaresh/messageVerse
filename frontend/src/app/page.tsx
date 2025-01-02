"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageCircle,
  Shield,
  Users,
  Zap,
  Globe,
  Lock,
  Sparkles,
  Check,
} from "lucide-react";
import { ThemeToggle } from "../components/theme-toggle";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-zinc-800">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-600">
        <div className="container flex h-16 items-center justify-between max-w-screen-xl mx-auto px-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-semibold text-gray-900 dark:text-white">
              MessageVerse
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#security"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            >
              Security
            </Link>
            <Link
              href="#testimonials"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            >
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              onClick={() => {
                router.push("/login");
              }}
            >
              Log in
            </Button>
            <Button
              onClick={() => {
                router.push("/register");
              }}
              className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Sign up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#001F54] to-[#00BFFF] dark:from-[#1F1F1F] dark:to-[#121212]">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Connect Instantly with MessageVerse
              </h1>
              <p className="text-xl text-blue-100">
                Experience seamless communication with friends and family
                through secure, private messaging - all in your web browser.
              </p>
              <div className="flex gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                  onClick={() => {
                    router.push("/register");
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="dark:text-white  border-white hover:bg-white/10"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="https://img.freepik.com/free-photo/medium-shot-brunette-woman-with-smartphone_23-2148294076.jpg"
                width={500}
                height={500}
                alt="MessageVerse App"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute top-1/4 -left-12 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
                <p className="text-gray-800 dark:text-white">
                  Hey! How&apos;s it going? 👋
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  9:41 AM
                </span>
              </div>
              <div className="absolute bottom-1/4 -right-12 bg-blue-100 dark:bg-blue-900 rounded-lg p-4 shadow-lg">
                <p className="text-blue-800 dark:text-blue-100">
                  Just tried MessageVerse, it&apos;s amazing! 🚀
                </p>
                <span className="text-xs text-blue-600 dark:text-blue-300">
                  9:42 AM
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-zinc-950">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Why Choose MessageVerse?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Experience the next generation of web messaging
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "Access Anywhere",
                description:
                  "Use MessageVerse on any device with a web browser - no downloads needed.",
              },
              {
                icon: Lock,
                title: "End-to-End Encryption",
                description:
                  "Your messages are secured with state-of-the-art encryption technology.",
              },
              {
                icon: Users,
                title: "Group Chats",
                description:
                  "Create and manage multiple group conversations effortlessly.",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Experience real-time messaging with minimal latency.",
              },
              {
                icon: Shield,
                title: "Privacy First",
                description:
                  "Your privacy is our priority - no data collection or tracking.",
              },
              {
                icon: Sparkles,
                title: "Rich Media Sharing",
                description:
                  "Share photos, videos, and documents seamlessly within your chats.",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-none shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-700"
              >
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 bg-zinc-50 dark:bg-zinc-900">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Uncompromising Security
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Your privacy and security are our top priorities
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="https://img.freepik.com/free-photo/side-view-woman-using-virtual-reality-headset_23-2148598108.jpg"
                width={600}
                height={400}
                alt="Security Illustration"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    End-to-End Encryption
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    All your messages are encrypted from end to end, ensuring
                    that only you and the intended recipients can read them.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    Data Protection
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We don&apos;t store your messages on our servers once
                    they&apos;re delivered, and we never share your personal
                    information.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    Regular Security Audits
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We conduct regular security audits and updates to ensure
                    your data remains protected against the latest threats.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-blue-600 dark:bg-blue-900">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-white">
              What Our Users Say
            </h2>
            <p className="text-xl text-blue-100">
              Hear from people who love MessageVerse
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "Marketing Manager",
                quote:
                  "MessageVerse has revolutionized how our team communicates. It&apos;s fast, secure, and incredibly user-friendly!",
              },
              {
                name: "Samantha Lee",
                role: "Freelance Designer",
                quote:
                  "As someone who works with clients globally, MessageVerse has been a game-changer for my business communications.",
              },
              {
                name: "Michael Chen",
                role: "Software Developer",
                quote:
                  "The end-to-end encryption and web-based platform make MessageVerse the perfect solution for our remote team&apos;s needs.",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="border-none shadow-lg dark:bg-gray-800"
              >
                <CardContent className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-200 dark:bg-blue-700 rounded-full mr-4"></div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white dark:bg-gray-800">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Choose the plan that&apos;s right for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Basic",
                price: "Free",
                features: [
                  "Unlimited messaging",
                  "Group chats up to 20 people",
                  "File sharing up to 100MB",
                  "Basic encryption",
                ],
              },
              {
                name: "Pro",
                price: "$9.99/month",
                features: [
                  "Everything in Basic",
                  "Group chats up to 100 people",
                  "File sharing up to 1GB",
                  "Advanced encryption",
                  "Priority support",
                ],
              },
              {
                name: "Enterprise",
                price: "Custom",
                features: [
                  "Everything in Pro",
                  "Unlimited group sizes",
                  "Unlimited file sharing",
                  "Custom integrations",
                  "Dedicated account manager",
                ],
              },
            ].map((plan, index) => (
              <Card
                key={index}
                className="border-none shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-700"
              >
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">
                    {plan.price}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                    Choose Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#001F54] to-[#00BFFF] dark:from-[#1F1F1F] dark:to-[#121212]">
        <div className="container max-w-screen-xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join millions of users already connecting on MessageVerse
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-blue-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            onClick={() => {
              router.push("/register");
            }}
          >
            Sign Up Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-semibold">MessageVerse</span>
              </div>
              <p className="text-gray-400">
                The next generation of web-based messaging.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#features"
                    className="text-gray-400 hover:text-white"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#security"
                    className="text-gray-400 hover:text-white"
                  >
                    Security
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-gray-400 hover:text-white"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#about"
                    className="text-gray-400 hover:text-white"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#blog" className="text-gray-400 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#careers"
                    className="text-gray-400 hover:text-white"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#privacy"
                    className="text-gray-400 hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#terms"
                    className="text-gray-400 hover:text-white"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="#cookies"
                    className="text-gray-400 hover:text-white"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} MessageVerse. All rights
              reserved.
            </p>
            <p>
              Made with ❤️ by <a href="https://amareshh.vercel.app" className="underline underline-offset-2">Amaresh</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
