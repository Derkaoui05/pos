"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface Settings {
  logo: string;      // Base64 string or URL
  logoText: string;  // Custom brand name (default: "NEXUS")
  primaryColor: string; // Hex or OKLCH color code
}

interface SettingsContextProps {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  logo: "",
  logoText: "NEXUS",
  primaryColor: "", // Default relies on global.css primary
};

const SettingsContext = createContext<SettingsContextProps | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  // 1. Hydrate settings from localStorage on client mount
  useEffect(() => {
    const saved = localStorage.getItem("apexpos_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    setMounted(true);
  }, []);

  // 2. Inject custom primary color dynamically to DOM :root
  useEffect(() => {
    if (!mounted) return;
    
    if (settings.primaryColor) {
      document.documentElement.style.setProperty("--primary", settings.primaryColor);
      // Inject sidebar-primary and other states if desired
      document.documentElement.style.setProperty("--sidebar-primary", settings.primaryColor);
    } else {
      // Remove styles to fall back to global.css
      document.documentElement.style.removeProperty("--primary");
      document.documentElement.style.removeProperty("--sidebar-primary");
    }
  }, [settings.primaryColor, mounted]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem("apexpos_settings", JSON.stringify(updated));
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem("apexpos_settings");
    document.documentElement.style.removeProperty("--primary");
    document.documentElement.style.removeProperty("--sidebar-primary");
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
