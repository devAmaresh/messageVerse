import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { useTheme } from "next-themes";
import React from "react";

const floatIcon = () => {
  const { setTheme, theme } = useTheme();
  return (
    <FloatButton
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      icon={theme === "light" ? <MoonOutlined /> : <SunOutlined />}
    />
  );
};

export default floatIcon;
