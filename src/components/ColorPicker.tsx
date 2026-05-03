import * as React from "react";
import { cn } from "@/lib/utils";

export const COLOR_PRESETS = [
  "#ff2d75",
  "#ffd84a",
  "#7c4dff",
  "#00bcd4",
  "#4caf50",
  "#ff9800",
  "#e91e63",
  "#2196f3",
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  swatchSize?: "sm" | "md";
  className?: string;
}

export function ColorPicker({
  value,
  onChange,
  swatchSize = "md",
  className,
}: ColorPickerProps) {
  const sizeClass = swatchSize === "sm" ? "h-7 w-7" : "h-9 w-9";
  const isCustom = !COLOR_PRESETS.includes(value.toLowerCase());

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {COLOR_PRESETS.map((c) => (
        <button
          type="button"
          key={c}
          onClick={() => onChange(c)}
          className={cn(
            sizeClass,
            "rounded-full border-2 transition-transform",
            value.toLowerCase() === c
              ? "border-foreground scale-110 shadow-lg"
              : "border-transparent hover:scale-105",
          )}
          style={{ background: c }}
          aria-label={`Choose ${c}`}
        />
      ))}
      <label
        className={cn(
          sizeClass,
          "relative rounded-full border-2 transition-transform cursor-pointer overflow-hidden",
          isCustom
            ? "border-foreground scale-110 shadow-lg"
            : "border-transparent hover:scale-105",
        )}
        style={{
          background: isCustom
            ? value
            : "conic-gradient(from 0deg, #ff2d75, #ffd84a, #4caf50, #00bcd4, #2196f3, #7c4dff, #e91e63, #ff2d75)",
        }}
        aria-label="Pick a custom color"
        title="Pick a custom color"
      >
        <input
          type="color"
          value={isCustom ? value : "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>
    </div>
  );
}
