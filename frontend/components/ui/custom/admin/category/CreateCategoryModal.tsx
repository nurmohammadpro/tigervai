"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { X, Plus, Loader2, Trash2 } from "lucide-react";
import { useUploadSingleImage } from "@/lib/useHandelImageUpload";
import { toast } from "sonner";
import { createCategory } from "@/actions/brand-category";

interface SubCategory {
  SubMain: string;
  subCategory: string[];
}

interface CreateCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateCategoryModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateCategoryModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    sub: [] as SubCategory[],
    isTop: false,
  });
  const [currentSubInput, setCurrentSubInput] = useState("");
  const [currentSubCategoryInputs, setCurrentSubCategoryInputs] = useState<{
    [key: number]: string;
  }>({});

  const { mutate: uploadImage, isPending: isUploading } =
    useUploadSingleImage();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return toast.error("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    uploadImage(formData, {
      onSuccess: (data) => {
        if (data.error) {
          toast.error(data.error.message);
        } else {
          setImagePreview(data?.data?.url as string);
        }
      },
    });
  };

  // Add new SubMain group
  const handleAddSubMain = () => {
    if (!currentSubInput.trim()) {
      toast.error("Please enter a subcategory name");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      sub: [...prev.sub, { SubMain: currentSubInput, subCategory: [] }],
    }));
    setCurrentSubInput("");
  };

  // Remove SubMain group
  const handleRemoveSubMain = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sub: prev.sub.filter((_, idx) => idx !== index),
    }));
    const newInputs = { ...currentSubCategoryInputs };
    delete newInputs[index];
    setCurrentSubCategoryInputs(newInputs);
  };

  // Add subCategory to specific SubMain
  const handleAddSubCategory = (subMainIndex: number) => {
    const input = currentSubCategoryInputs[subMainIndex]?.trim();
    if (!input) {
      toast.error("Please enter a sub-item name");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      sub: prev.sub.map((subMain, idx) =>
        idx === subMainIndex
          ? {
              ...subMain,
              subCategory: [...subMain.subCategory, input],
            }
          : subMain
      ),
    }));

    setCurrentSubCategoryInputs((prev) => ({
      ...prev,
      [subMainIndex]: "",
    }));
  };

  // Remove subCategory from specific SubMain
  const handleRemoveSubCategory = (
    subMainIndex: number,
    subCatIndex: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      sub: prev.sub.map((subMain, idx) =>
        idx === subMainIndex
          ? {
              ...subMain,
              subCategory: subMain.subCategory.filter(
                (_, i) => i !== subCatIndex
              ),
            }
          : subMain
      ),
    }));
  };

  const { mutate: postCategoryMutation, isPending: isLoading } = useMutation({
    mutationKey: ["categories"],
    mutationFn: (data: Record<string, unknown>) => createCategory(data),
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data.error.message);
      } else {
        toast.success("Category created successfully");
        onOpenChange(false);
        onSuccess?.();
        // Reset form
        setFormData({ name: "", sub: [], isTop: false });
        setImagePreview(null);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Unknown error");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    const payload = {
      name: formData.name,
      logoUrl: imagePreview,
      sub: formData.sub,
      isTop: formData.isTop,
    };

    postCategoryMutation(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-palette-bg border-palette-accent-3">
        <DialogHeader>
          <DialogTitle className="text-palette-text">
            Create Category
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-palette-text">Category Logo</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-palette-accent-3 rounded-lg p-6 text-center cursor-pointer hover:border-palette-btn transition"
            >
              {imagePreview ? (
                <div className="relative w-24 h-24 mx-auto">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : isUploading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                <div className="text-palette-accent-3">
                  <p className="font-medium">Click to upload logo</p>
                  <p className="text-sm">PNG, JPG, GIF up to 5MB</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-palette-text">
              Category Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter category name"
              required
              className="bg-palette-bg border-palette-accent-3 text-palette-text placeholder:text-palette-accent-3"
            />
          </div>

          {/* Is Top Category Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isTop"
              checked={formData.isTop}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isTop: checked as boolean })
              }
              className="border-palette-accent-3"
            />
            <Label htmlFor="isTop" className="text-palette-text cursor-pointer">
              Mark as top category
            </Label>
          </div>

          {/* Subcategories Section */}
          <div className="space-y-4">
            <Label className="text-palette-text">Subcategories</Label>

            {/* Add New SubMain */}
            <div className="flex gap-2">
              <Input
                value={currentSubInput}
                onChange={(e) => setCurrentSubInput(e.target.value)}
                placeholder="Enter subcategory name"
                className="bg-palette-bg border-palette-accent-3 text-palette-text placeholder:text-palette-accent-3"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddSubMain())
                }
              />
              <Button
                type="button"
                onClick={handleAddSubMain}
                className="bg-palette-btn text-white hover:opacity-90"
              >
                <Plus size={16} />
              </Button>
            </div>

            {/* Display SubMain Groups */}
            <div className="space-y-4">
              {formData.sub.map((subMain, subMainIndex) => (
                <div
                  key={subMainIndex}
                  className="border border-palette-accent-3 rounded-lg p-4 space-y-3"
                >
                  {/* SubMain Header */}
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-palette-text">
                      {subMain.SubMain}
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSubMain(subMainIndex)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  {/* Add SubCategory Items */}
                  <div className="flex gap-2">
                    <Input
                      value={currentSubCategoryInputs[subMainIndex] || ""}
                      onChange={(e) =>
                        setCurrentSubCategoryInputs((prev) => ({
                          ...prev,
                          [subMainIndex]: e.target.value,
                        }))
                      }
                      placeholder="Add sub-item"
                      className="bg-palette-bg border-palette-accent-3 text-palette-text placeholder:text-palette-accent-3 text-sm"
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddSubCategory(subMainIndex))
                      }
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleAddSubCategory(subMainIndex)}
                      className="bg-palette-btn/80 text-white hover:opacity-90"
                    >
                      <Plus size={14} />
                    </Button>
                  </div>

                  {/* Display SubCategory Tags */}
                  {subMain.subCategory.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {subMain.subCategory.map((subCat, subCatIndex) => (
                        <div
                          key={subCatIndex}
                          className="flex items-center gap-1 bg-palette-btn/20 text-palette-btn px-3 py-1 rounded-full text-sm"
                        >
                          {subCat}
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveSubCategory(subMainIndex, subCatIndex)
                            }
                            className="hover:opacity-70"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-palette-accent-3 text-palette-text hover:bg-palette-accent-3/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-palette-btn text-white hover:opacity-90"
            >
              {isLoading ? "Creating..." : "Create Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
