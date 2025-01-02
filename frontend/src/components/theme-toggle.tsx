"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? <MoonOutlined /> : <SunOutlined />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
