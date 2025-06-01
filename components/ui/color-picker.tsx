"use client";

import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";

import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

const defaultColors = [
  "#5865F2", "#57F287", "#FEE75C", "#EB459E", "#ED4245",
  "#FFFFFF", "#000000", "#1ABC9C", "#2ECC71", "#3498DB",
  "#9B59B6", "#E91E63", "#F1C40F", "#E67E22", "#E74C3C"
];

export const ColorPicker = ({ color, onChange, className = "" }: ColorPickerProps) => {
  const [inputColor, setInputColor] = useState(color);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setInputColor(color);
  }, [color]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setInputColor(newColor);
    onChange(newColor);
  };

  const handlePresetClick = (presetColor: string) => {
    setInputColor(presetColor);
    onChange(presetColor);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-10 h-10 p-0 rounded-full ${className}`}
          style={{ backgroundColor: color }}
          aria-label="Pick a color"
        >
          <span className="sr-only">Open color picker</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={inputColor}
              onChange={handleColorChange}
              className="w-10 h-10 cursor-pointer"
            />
            <input
              type="text"
              value={inputColor}
              onChange={(e) => setInputColor(e.target.value)}
              onBlur={() => onChange(inputColor)}
              className="px-2 py-1 border rounded w-24 text-sm"
            />
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {defaultColors.map((presetColor) => (
              <button
                key={presetColor}
                onClick={() => handlePresetClick(presetColor)}
                className="w-6 h-6 rounded-full border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                style={{ backgroundColor: presetColor }}
                aria-label={`Color ${presetColor}`}
              >
                {color === presetColor && (
                  <FaCheck className="w-full h-full text-white mix-blend-difference" />
                )}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};