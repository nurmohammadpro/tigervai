"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryPaginationControlsProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function CategoryPaginationControls({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
}: CategoryPaginationControlsProps) {
  return (
    <div className="flex items-center justify-between pt-4 text-palette-text">
      <div className="flex items-center gap-2">
        <span className="text-sm">Items per page:</span>
        <Select
          value={limit.toString()}
          onValueChange={(v) => onLimitChange(Number(v))}
        >
          <SelectTrigger className="w-20 bg-palette-bg border-palette-accent-3 text-palette-text">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-palette-bg border-palette-accent-3">
            <SelectItem value="5" className="text-palette-text">
              5
            </SelectItem>
            <SelectItem value="10" className="text-palette-text">
              10
            </SelectItem>
            <SelectItem value="20" className="text-palette-text">
              20
            </SelectItem>
            <SelectItem value="50" className="text-palette-text">
              50
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm text-palette-accent-3">
        Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of{" "}
        {total} items
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="border-palette-accent-3 text-palette-text hover:bg-palette-accent-3/10 disabled:opacity-50"
        >
          <ChevronLeft size={16} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled
          className="w-10 border-palette-accent-3 text-palette-text"
        >
          {page}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="border-palette-accent-3 text-palette-text hover:bg-palette-accent-3/10 disabled:opacity-50"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
