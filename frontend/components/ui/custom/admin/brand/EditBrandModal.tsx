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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, X } from "lucide-react";
import { useQueryWrapper } from "@/api-hook/react-query-wrapper";
import { toast } from "sonner";
import { useUploadSingleImage } from "@/lib/useHandelImageUpload";
import { UpdateBrand } from "@/actions/brand-category";

interface Brand {
  _id: string;
  name: string;
  logoUrl?: string;
  categories?: string[];
  isTop?: boolean;
}

interface EditBrandModalProps {
  brand: Brand;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditBrandModal({
  brand,
  open,
  onOpenChange,
  onSuccess,
}: EditBrandModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    brand.logoUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: brand.name,
    categories: brand.categories || [],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [openCombobox, setOpenCombobox] = useState(false);

  const { data: categoriesData } = useQueryWrapper(
    ["categories"],
    `/category?page=${1}&limit=${50}`
  );
  const { mutate: uploadImage, isPending: isUploadingImage } =
    useUploadSingleImage();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return toast.error("Please select a file");

    const fromData = new FormData();
    fromData.append("file", file!);
    uploadImage(fromData);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };
  const { mutate: UpdateBrandFN, isPending: isLoading } = useMutation({
    mutationKey: ["updated-brand"],
    mutationFn: (payload: any) => UpdateBrand(brand._id, payload),
    onSuccess: (data) => {
      if (data?.error) {
        toast.success(data.error?.message);
        return;
      }

      toast.success("Brand update successfully");
      onSuccess?.();
    },
    onError: (data) => {
      toast.error(data?.message || "Unknown error");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Brand name is required");
      return;
    }
    const payload = {
      name: formData.name,
      logoUrl: imagePreview,
      categories: formData.categories,
    };
    console.log("payload", payload);

    UpdateBrandFN(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-palette-bg border-palette-accent-3">
        <DialogHeader>
          <DialogTitle className="text-palette-text">Edit Brand</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-palette-text">Brand Logo</Label>
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
              ) : isUploadingImage ? (
                <Loader2 className=" animate-spin" />
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

          {/* Brand Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-palette-text">
              Brand Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter brand name"
              required
              className="bg-palette-bg border-palette-accent-3 text-palette-text placeholder:text-palette-accent-3"
            />
          </div>

          {/* Categories Combobox */}
          <div className="space-y-2">
            <Label className="text-palette-text">Categories</Label>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-full justify-between bg-palette-bg border-palette-accent-3 text-palette-text hover:bg-palette-bg hover:text-palette-text"
                >
                  {formData.categories.length > 0
                    ? `${formData.categories.length} selected`
                    : "Select categories..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-palette-bg border-palette-accent-3">
                <Command className="bg-palette-bg">
                  <CommandInput
                    placeholder="Search categories..."
                    className="text-palette-text placeholder:text-palette-accent-3"
                  />
                  <CommandEmpty className="text-palette-accent-3">
                    No categories found.
                  </CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {categoriesData?.data?.map((category: any) => (
                        <CommandItem
                          key={category._id}
                          value={category.name}
                          onSelect={() => handleCategoryToggle(category?.name)}
                          className="text-palette-text hover:bg-palette-btn/20"
                        >
                          <Checkbox
                            checked={formData.categories.includes(
                              category.name
                            )}
                            className="mr-2 border-palette-accent-3"
                          />
                          {category.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {formData.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.categories.map((catId) => {
                  return (
                    <div
                      key={catId}
                      className="flex items-center gap-1 bg-palette-btn/20 text-palette-btn px-3 py-1 rounded-full text-sm"
                    >
                      {catId}
                      <button
                        type="button"
                        onClick={() => handleCategoryToggle(catId)}
                        className="hover:opacity-70"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
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
              {isLoading ? "Updating..." : "Update Brand"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
function onRefresh() {
  throw new Error("Function not implemented.");
}
