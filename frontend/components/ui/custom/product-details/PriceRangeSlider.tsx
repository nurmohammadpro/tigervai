"use client";

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
}

export function PriceRangeSlider({
  min,
  max,
  value,
  onValueChange,
}: PriceRangeSliderProps) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-palette-text">
        Price Range
      </Label>
      <Slider
        min={min}
        max={max}
        step={100}
        value={value}
        onValueChange={onValueChange}
      />
      <div className="flex justify-between text-sm text-gray-600">
        <span>৳{value[0].toLocaleString()}</span>
        <span>৳{value[1].toLocaleString()}</span>
      </div>
    </div>
  );
}
