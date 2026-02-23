"use client";

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface RangeSliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  prefix?: string;
  suffix?: string;
}

export function RangeSlider({
  label,
  min,
  max,
  step = 1,
  value,
  onValueChange,
  prefix = "",
  suffix = "",
}: RangeSliderProps) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-palette-text">{label}</Label>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={onValueChange}
      />
      <div className="flex justify-between text-sm text-gray-600">
        <span className="font-medium">
          {prefix}
          {value[0]}
          {suffix}
        </span>
        <span className="font-medium">
          {prefix}
          {value[1]}
          {suffix}
        </span>
      </div>
    </div>
  );
}
