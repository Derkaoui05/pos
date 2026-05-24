"use client";
import React, { useRef } from "react";
import AppNavbar from "@/components/layout/AppNavbar";
import DashboardSubNav from "@/components/dashboard/DashboardSubNav";
import { useSettings } from "@/providers/SettingsProvider";
import { toast } from "sonner";
import { Upload, RotateCcw, Palette, Image as ImageIcon, Sparkles, Paintbrush, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const PRESET_COLORS = [
  { name: "Ocean Blue", value: "oklch(0.52 0.105 223.128)" },
  { name: "Emerald Jade", value: "oklch(0.64 0.17 145.2)" },
  { name: "Amethyst Violet", value: "oklch(0.58 0.19 285.3)" },
  { name: "Ruby Crimson", value: "oklch(0.56 0.21 27.5)" },
  { name: "Amber Gold", value: "oklch(0.68 0.16 68.4)" },
  { name: "Steel Slate", value: "oklch(0.38 0.02 240.0)" },
];

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { t, i18n } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Logo Upload (read file as base64)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo file size must be under 2MB!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateSettings({ logo: reader.result });
        toast.success("Store logo uploaded and applied successfully!");
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Brand Text Change
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ logoText: e.target.value });
  };

  // Handle Color Swatch Click
  const handleColorSelect = (colorValue: string, name: string) => {
    updateSettings({ primaryColor: colorValue });
    toast.success(`Theme updated to ${name}!`);
  };

  // Handle Custom Color Pick
  const handleCustomColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ primaryColor: e.target.value });
  };

  // Handle Reset All
  const handleReset = () => {
    resetSettings();
    toast.success("Settings restored to system defaults!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/50 dark:bg-zinc-950/20 pb-10">
      <AppNavbar />
      <DashboardSubNav />

      <main className="flex-1 p-6 space-y-6 max-w-4xl w-full mx-auto">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {t('settings.title', 'Terminal Settings')}
            </h1>
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mt-0.5">
              {t('settings.subtitle', 'Customize brand visual elements and primary color systems')}
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="h-8 text-xs font-bold gap-1.5 border-border uppercase tracking-wider bg-card text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Reset Defaults
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: BRAND IDENTITY CUSTOMIZATION (2 Cols) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Card 1: Brand Customizer */}
            <div className="border border-border rounded-3xl p-6 bg-card text-card-foreground shadow-2xs">
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-border/40">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <h2 className="text-sm font-bold tracking-tight text-foreground uppercase">
                  Brand Identity Customizer
                </h2>
              </div>

              <div className="space-y-6">
                {/* 1. Store Moniker Name */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Store / Terminal Name
                  </label>
                  <input
                    type="text"
                    value={settings.logoText}
                    onChange={handleTextChange}
                    placeholder="E.g. Othmane POS"
                    className="w-full px-4 h-10 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground transition-all duration-200"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    This updates the main business text moniker displayed on headers and invoices.
                  </p>
                </div>

                {/* 2. Custom Logo Image File Drop */}
                <div className="space-y-3">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Brand Logo Image
                  </label>
                  <div className="flex items-center gap-4">
                    {/* Preview Box */}
                    <div className="h-20 w-20 rounded-2xl border border-border bg-muted flex items-center justify-center overflow-hidden shadow-2xs shrink-0">
                      {settings.logo ? (
                        <img
                          src={settings.logo}
                          alt="Custom Logo Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-muted-foreground/60" />
                      )}
                    </div>

                    {/* Controls */}
                    <div className="space-y-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="h-8 text-[10px] font-bold gap-1.5 uppercase tracking-wider"
                        >
                          <Upload className="h-3 w-3" />
                          Upload Logo File
                        </Button>
                        {settings.logo && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateSettings({ logo: "" })}
                            className="h-8 text-[10px] font-bold text-destructive hover:bg-destructive/5 uppercase tracking-wider"
                          >
                            Remove Logo
                          </Button>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        PNG, JPG, or SVG. Maximum file size 2MB. Logo renders in standard headers.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Card 2: Visual Preview */}
            <div className="border border-border rounded-3xl p-6 bg-card text-card-foreground shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Brand Header Simulation Preview
              </h3>
              
              {/* Fake navbar header preview */}
              <div className="border border-border rounded-2xl bg-background/50 p-4 flex items-center justify-between shadow-2xs select-none">
                <div className="flex items-center gap-2">
                  {settings.logo ? (
                    <img
                      src={settings.logo}
                      alt="Brand Logo"
                      className="h-8 w-8 rounded-lg object-cover border border-border shadow-2xs"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-2xs">
                      <ImageIcon className="h-4 w-4" />
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-xs tracking-tight text-foreground block leading-none">
                      {settings.logoText || "NEXUS"}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-semibold tracking-wider uppercase">
                      POS System
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-6 w-12 rounded bg-muted/40" />
                  <div className="h-6 w-14 rounded bg-primary" />
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: COLORS THEME (1 Col) */}
          <div className="space-y-6">
            
            {/* Card 3: Color Palette Picker */}
            <div className="border border-border rounded-3xl p-6 bg-card text-card-foreground shadow-2xs flex flex-col h-full">
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-border/40">
                <Palette className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold tracking-tight text-foreground uppercase">
                  App Accent Colors
                </h2>
              </div>

              <div className="space-y-6 flex-1 flex flex-col justify-between">
                
                {/* 1. Designer Presets Swatches */}
                <div className="space-y-3">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Curated Presets
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {PRESET_COLORS.map((preset) => {
                      const isActive = settings.primaryColor === preset.value;
                      return (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => handleColorSelect(preset.value, preset.name)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[10px] font-bold text-left transition-all duration-200 select-none
                            ${isActive
                              ? "border-primary bg-primary/5 text-foreground shadow-2xs"
                              : "border-border bg-background hover:bg-muted text-muted-foreground"}`}
                        >
                          <div
                            className="h-3.5 w-3.5 rounded-full shadow-2xs shrink-0"
                            style={{ backgroundColor: preset.value }}
                          />
                          <span className="truncate">{preset.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Color Picker Drawer */}
                <div className="space-y-3 pt-6 border-t border-border/40">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Paintbrush className="h-3 w-3 text-primary" />
                    Custom Color Pick
                  </label>
                  
                  <div className="flex items-center gap-3 bg-muted/40 p-3 rounded-2xl border border-border/50">
                    <div className="relative h-10 w-10 rounded-xl overflow-hidden shadow-2xs shrink-0 border border-border">
                      <input
                        type="color"
                        value={settings.primaryColor.startsWith("#") ? settings.primaryColor : "#5285e4"}
                        onChange={handleCustomColor}
                        className="absolute inset-0 h-14 w-14 p-0 border-0 cursor-pointer -translate-x-2 -translate-y-2"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-foreground block mb-0.5">
                        Infinite Spectrum
                      </span>
                      <span className="text-[9px] text-muted-foreground block truncate">
                        Select any hex shade from the color spectrum box.
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Card 4: Localization & Language */}
            <div className="border border-border rounded-3xl p-6 bg-card text-card-foreground shadow-2xs">
              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-border/40">
                <Globe className="h-4 w-4 text-blue-500" />
                <h2 className="text-sm font-bold tracking-tight text-foreground uppercase">
                  {t('settings.languages', 'Localization & Language')}
                </h2>
              </div>

              <div className="space-y-4">
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {t('settings.languages_desc', 'Set your preferred interface language. This affects menus, buttons, and layouts.')}
                </p>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    {t('settings.select_language', 'Select Interface Language')}
                  </label>
                  <select
                    value={i18n.language}
                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                    className="w-full px-3 h-10 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                  >
                    <option value="en">{t('settings.language_english', 'English (US)')}</option>
                    <option value="fr">{t('settings.language_french', 'Français')}</option>
                    <option value="ar">{t('settings.language_arabic', 'العربية')}</option>
                    <option value="de">{t('settings.language_german', 'Deutsch')}</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
