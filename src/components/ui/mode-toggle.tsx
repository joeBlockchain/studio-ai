"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <Label htmlFor="theme-mode" className="sr-only">
        Toggle theme
      </Label>
      <div
        className="group inline-flex items-center gap-2"
        data-state={theme === "light" ? "checked" : "unchecked"}
      >
        <span
          id="switch-off-label"
          className="flex-1 cursor-pointer text-right text-sm font-medium group-data-[state=checked]:text-muted-foreground/70"
          onClick={() => setTheme("dark")}
        >
          <Moon size={16} strokeWidth={2} aria-hidden="true" />
        </span>
        <Switch
          id="theme-mode"
          checked={theme === "light"}
          onCheckedChange={(checked) => setTheme(checked ? "light" : "dark")}
          aria-labelledby="switch-off-label switch-on-label"
          aria-label="Toggle between dark and light mode"
        />
        <span
          id="switch-on-label"
          className="flex-1 cursor-pointer text-left text-sm font-medium group-data-[state=unchecked]:text-muted-foreground/70"
          onClick={() => setTheme("light")}
        >
          <Sun size={16} strokeWidth={2} aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}
