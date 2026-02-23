// app/dashboard/products/edit/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Pen,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Checkbox } from "@/components/ui/checkbox";
import { useEditProductStore } from "@/zustan-hook/editProductStore";
import { ImageUploadField } from "@/components/ui/custom/admin/create-edit-product/ImageUploadField";
import {
  calculateAverageOfferPrice,
  calculateAveragePrice,
  calculateTotalStock,
} from "@/lib/calculation-helper";
import {
  useApiMutation,
  useQueryWrapper,
} from "@/api-hook/react-query-wrapper";
import { Product, ProductImage } from "@/@types/fullProduct";
import { BrandResponse, CategoryResponse } from "@/@types/category-brand";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ImageUploadFieldUpdate } from "@/components/ui/custom/admin/create-edit-product/create-product/UpdateImageField";
import { updateProductAdmin } from "@/actions/product";
import RichTextEditor from "@/components/ui/custom/addProduct/Description";
import { ReactSortable } from "react-sortablejs";
import { useUploadSingleImage } from "@/lib/useHandelImageUpload";
// Static product data for demo
const STATIC_PRODUCTS: Record<string, any> = {
  "1": {
    _id: "1",
    name: "Premium Cotton T-Shirt",
    price: 1200,
    offerPrice: 999,
    stock: 45,
    description: "High-quality cotton t-shirt perfect for everyday wear",
    category: { main: "MEN", category: "T-Shirts" },
    brand: { id: "brand1", name: "Nike" },
    isActive: true,
    hasOffer: true,
    variants: [
      { size: "M", color: "Red", price: 1200, discountPrice: 999, stock: 15 },
      { size: "L", color: "Red", price: 1200, discountPrice: 999, stock: 20 },
      { size: "M", color: "Blue", price: 1200, stock: 10 },
    ],
    thumbnail: { url: "/placeholder.jpg", key: "thumb1", id: "t1" },
    images: [
      { url: "/placeholder.jpg", key: "img1", id: "i1" },
      { url: "/placeholder.jpg", key: "img2", id: "i2" },
    ],
    specifications: { Material: "100% Cotton", Care: "Machine Wash 30°C" },
    shippingCost: 100,
    freeShipping: false,
    shippingTime: "2-3 business days",
    height: 70,
    width: 50,
    weight: "0.2kg",
    size: "M",
    warrantyPeriod: "12 months",
    returnPolicy: "30 days",
    certifications: ["ISO 9001", "CE Certified"],
  },
};

const CATEGORIES = [
  { main: "MEN", subcategories: ["T-Shirts", "Shoes", "Jeans", "Accessories"] },
  { main: "WOMEN", subcategories: ["Dresses", "Tops", "Shoes", "Accessories"] },
  { main: "KIDS", subcategories: ["T-Shirts", "Shoes", "Pants"] },
];

const BRANDS = [
  { id: "brand1", name: "Nike" },
  { id: "brand2", name: "Adidas" },
  { id: "brand3", name: "Levi's" },
  { id: "brand4", name: "Zara" },
  { id: "brand5", name: "Fossil" },
];
interface Variant {
  size: string;
  color: string;
  price: number;
  stock: number;
  discountPrice?: number;
  sku?: string;
  recommended?: string;
  image?: {
    url: string;
    key: string;
    id: string;
  };
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const { formData, loadProduct, updateField, getChangedFields } =
    useEditProductStore();
  const [isBrandInputMode, setIsBrandInputMode] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    variants: true,
    media: false,
    shipping: false,
    additional: false,
  });
  const [newVariant, setNewVariant] = useState<Variant>({
    size: "",
    color: "",
    price: 0,
    stock: 0,
    recommended: "",
    discountPrice: 0,
  });
  const { data: productDetails, isPending } = useQueryWrapper<Product>(
    [productId],
    `/product/get-product?slug=${productId}`
  );

  const {
    data: brandsData,
    isLoading,
    refetch,
  } = useQueryWrapper<BrandResponse>(["brands"], `/brand?page=1&limit=20`);

  const { data: categoriesData } = useQueryWrapper<CategoryResponse>(
    ["categories"],
    `/category?page=1&limit=30`
  );
  const [newSpec, setNewSpec] = useState({ key: "", value: "" });

  useEffect(() => {
    if (productDetails) {
      loadProduct(productDetails);
    }
  }, [loadProduct, productDetails]);

  const { mutate, isPending: isSubmitting } = useApiMutation(
    updateProductAdmin,
    undefined,
    "update-product"
  );
  const handleSave = async () => {
    mutate({ id: productDetails?._id!, payload: formData });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleAddVariant = () => {
    if (!newVariant.size || !newVariant.color || newVariant.price <= 0) {
      alert("Please fill all required variant fields");
      return;
    }

    const variants = (formData?.variants as any[]) || [];
    updateField("variants", [...variants, newVariant]);
    setNewVariant({
      size: "",
      color: "",
      price: 0,
      stock: 0,
      recommended: "",
      discountPrice: 0,
      image: { url: "", key: "", id: "" },
    });
  };

  const handleRemoveVariant = (index: number) => {
    const variants = (formData?.variants as any[]) || [];
    updateField(
      "variants",
      variants.filter((_, i) => i !== index)
    );
  };

  const handleAddSpec = () => {
    if (!newSpec.key || !newSpec.value) {
      alert("Please fill both key and value");
      return;
    }

    const specifications =
      (formData?.specifications as Record<string, string>) || {};
    updateField("specifications", {
      ...specifications,
      [newSpec.key]: newSpec.value,
    });

    setNewSpec({ key: "", value: "" });
  };
  const { mutate: uploadImage, isPending: isImageUploading } =
    useUploadSingleImage();
  const handelUploadImage = (file: File) => {
    const fromData = new FormData();
    fromData.append("file", file);
    uploadImage(fromData, {
      onSuccess: (data) => {
        setNewVariant({
          ...newVariant,
          image: {
            url: data?.data?.url as string,
            key: data?.data?.key as string,
            id: data?.data?.key as string,
          },
        });
      },
    });
  };
  const handleRemoveImage = () => {
    setNewVariant({
      ...newVariant,
      image: undefined,
    });
  };

  const handleRemoveSpec = (key: string) => {
    const specifications =
      (formData?.specifications as Record<string, string>) || {};
    const newSpecs = { ...specifications };
    delete newSpecs[key];
    updateField("specifications", newSpecs);
  };

  // Calculate auto values
  const variants = (formData?.variants as any[]) || [];
  const avgPrice = variants.length > 0 ? calculateAveragePrice(variants) : 0;
  const avgOfferPrice =
    variants.length > 0 ? calculateAverageOfferPrice(variants) : null;
  const totalStock = variants.length > 0 ? calculateTotalStock(variants) : 0;

  if (!formData) {
    return (
      <div
        className="min-h-screen p-6 flex items-center justify-center"
        style={{
          backgroundColor: "var(--palette-bg)",
          color: "var(--palette-text)",
        }}
      >
        <p>Loading product...</p>
      </div>
    );
  }

  const findOneSub = categoriesData?.data?.find(
    (item) => item?.name === formData.category?.main
  );
  const findOneSubCategory = findOneSub?.sub?.find(
    (item) => item?.SubMain === formData.category?.subMain
  );
  const images = (formData.images as ProductImage[]) || [];
  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor: "var(--palette-bg)",
        color: "var(--palette-text)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/admin/my-products">
              <button className="p-2 hover:bg-white/10 rounded transition">
                <ArrowLeft size={24} />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Edit Product</h1>
              <p style={{ color: "var(--palette-accent-3)" }}>
                {formData.name}
              </p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex items-center gap-2 text-white"
            style={{ backgroundColor: "var(--palette-btn)" }}
          >
            <Save size={20} />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-4">
          {/* BASIC INFORMATION SECTION */}
          <div
            className="rounded-lg border"
            style={{
              borderColor: "var(--palette-accent-3)",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
            }}
          >
            <button
              onClick={() => toggleSection("basic")}
              className="w-full p-4 flex justify-between items-center hover:bg-white/5 transition"
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                📋 Basic Information
              </h2>
              {expandedSections.basic ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>

            {expandedSections.basic && (
              <div
                className="p-4 border-t"
                style={{ borderColor: "var(--palette-accent-3)" }}
              >
                <div className="space-y-4">
                  {/* Product Name */}
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: "var(--palette-accent-1)" }}
                    >
                      Product Name
                    </label>
                    <Input
                      value={formData.name || ""}
                      onChange={(e) => updateField("name", e.target.value)}
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderColor: "var(--palette-accent-3)",
                        color: "var(--palette-text)",
                      }}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: "var(--palette-accent-1)" }}
                    >
                      Description
                    </label>
                    {/* <Textarea
                      value={formData.description || ""}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                      rows={4}
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderColor: "var(--palette-accent-3)",
                        color: "var(--palette-text)",
                      }}
                    /> */}
                    <RichTextEditor
                      description={formData?.description ?? ""}
                      updateField={updateField}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: "var(--palette-accent-1)" }}
                    >
                      short Description
                    </label>

                    <Textarea
                      placeholder="Enter product short description"
                      value={formData.shortDescription || ""}
                      onChange={(e) =>
                        updateField("shortDescription", e.target.value)
                      }
                      rows={4}
                      style={{}}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: "var(--palette-accent-1)" }}
                    >
                      company details
                    </label>

                    <Textarea
                      placeholder=" company details"
                      value={formData.company_details || ""}
                      onChange={(e) =>
                        updateField("company_details", e.target.value)
                      }
                      rows={4}
                      style={{}}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: "var(--palette-accent-1)" }}
                    >
                      Special Offer
                    </label>

                    <Textarea
                      placeholder="Enter special offer "
                      value={formData.special_offer || ""}
                      onChange={(e) =>
                        updateField("special_offer", e.target.value)
                      }
                      rows={4}
                      style={{}}
                    />
                  </div>

                  {/* Category */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-sm font-semibold mb-2"
                        style={{ color: "var(--palette-accent-1)" }}
                      >
                        Main Category
                      </label>
                      <Select
                        value={formData.category?.main || ""}
                        onValueChange={(value) =>
                          updateField("category", {
                            main: value,
                            category: "",
                          })
                        }
                      >
                        <SelectTrigger
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            borderColor: "var(--palette-accent-3)",
                            color: "var(--palette-text)",
                          }}
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent
                          style={{
                            backgroundColor: "var(--palette-bg)",
                            color: "var(--palette-text)",
                          }}
                        >
                          {categoriesData?.data?.map((cat) => (
                            <SelectItem key={cat.name} value={cat.name}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {(findOneSub?.sub.length ?? 0) > 0 && (
                      <div>
                        <label
                          className="block text-sm font-semibold mb-2"
                          style={{ color: "var(--palette-accent-1)" }}
                        >
                          Sub Group *
                        </label>
                        <Select
                          value={formData.category?.subMain || ""}
                          onValueChange={(value) =>
                            updateField("category", {
                              ...formData.category,
                              subMain: value,
                            })
                          }
                        >
                          <SelectTrigger
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.05)",
                              borderColor: "var(--palette-accent-3)",
                              color: "var(--palette-text)",
                            }}
                          >
                            <SelectValue placeholder="Select sub category" />
                          </SelectTrigger>
                          <SelectContent
                            style={{
                              backgroundColor: "var(--palette-bg)",
                              color: "var(--palette-text)",
                            }}
                          >
                            {findOneSub?.sub?.map((subcat) => (
                              <SelectItem
                                key={subcat.SubMain}
                                value={subcat.SubMain}
                              >
                                {subcat.SubMain}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {(findOneSubCategory?.subCategory?.length ?? 0) > 0 && (
                      <div>
                        <label
                          className="block text-sm font-semibold mb-2"
                          style={{ color: "var(--palette-accent-1)" }}
                        >
                          Sub Category
                        </label>
                        <Select
                          value={formData.category?.category || ""}
                          onValueChange={(value) =>
                            updateField("category", {
                              ...formData.category,
                              category: value,
                            })
                          }
                        >
                          <SelectTrigger
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.05)",
                              borderColor: "var(--palette-accent-3)",
                              color: "var(--palette-text)",
                            }}
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent
                            style={{
                              backgroundColor: "var(--palette-bg)",
                              color: "var(--palette-text)",
                            }}
                          >
                            {findOneSubCategory?.subCategory?.map((subcat) => (
                              <SelectItem key={subcat} value={subcat}>
                                {subcat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Brand */}
                  <div>
                    {/* Toggle Switch */}
                    <div className="flex items-center gap-2 mb-3">
                      <Switch
                        id="brand-mode"
                        checked={isBrandInputMode}
                        onCheckedChange={setIsBrandInputMode}
                      />
                      <Label
                        htmlFor="brand-mode"
                        className="text-sm"
                        style={{ color: "var(--palette-text)" }}
                      >
                        {isBrandInputMode
                          ? "Custom Brand Name"
                          : "Select from Existing"}
                      </Label>
                    </div>

                    {/* Brand Field Label */}
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: "var(--palette-accent-1)" }}
                    >
                      Brand *
                    </label>

                    {/* Conditional Rendering: Dropdown or Input */}
                    {!isBrandInputMode ? (
                      <Select
                        value={formData.brand?.id || ""}
                        onValueChange={(value) => {
                          const brand = brandsData?.data?.find(
                            (b) => b._id === value
                          );
                          if (brand) {
                            updateField("brand", {
                              id: brand._id,
                              name: brand.name,
                            });
                          }
                        }}
                      >
                        <SelectTrigger
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            borderColor: "var(--palette-accent-3)",
                            color: "var(--palette-text)",
                          }}
                        >
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent
                          style={{
                            backgroundColor: "var(--palette-bg)",
                            color: "var(--palette-text)",
                          }}
                        >
                          {brandsData?.data?.map((brand) => (
                            <SelectItem key={brand._id} value={brand._id}>
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type="text"
                        placeholder="Enter custom brand name"
                        value={formData.brand?.name || ""}
                        onChange={(e) => {
                          updateField("brand", {
                            id: "",
                            name: e.target.value,
                          });
                        }}
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          borderColor: "var(--palette-accent-3)",
                          color: "var(--palette-text)",
                        }}
                        className="w-full"
                      />
                    )}
                  </div>

                  {/* Status */}
                  <div
                    className="flex items-center gap-3 p-4 rounded-lg"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid var(--palette-accent-3)",
                    }}
                  >
                    <Checkbox
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        updateField("isActive", checked)
                      }
                      id="isActive"
                    />
                    <label
                      htmlFor="isActive"
                      className="cursor-pointer font-medium"
                    >
                      Product is Active
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* VARIANTS SECTION */}
          <div
            className="rounded-lg border"
            style={{
              borderColor: "var(--palette-accent-3)",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
            }}
          >
            <button
              onClick={() => toggleSection("variants")}
              className="w-full p-4 flex justify-between items-center hover:bg-white/5 transition"
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                📦 Variants ({variants.length})
              </h2>
              {expandedSections.variants ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>

            {expandedSections.variants && (
              <div
                className="p-4 border-t"
                style={{ borderColor: "var(--palette-accent-3)" }}
              >
                <div className="space-y-4">
                  {/* Add Variant Form */}
                  <div
                    className="p-4 rounded-lg border"
                    style={{
                      borderColor: "var(--palette-accent-3)",
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                    }}
                  >
                    <h3
                      className="font-semibold mb-4"
                      style={{ color: "var(--palette-accent-1)" }}
                    >
                      Add New Variant
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div>
                        <label
                          className="text-xs font-semibold mb-1 block"
                          style={{ color: "var(--palette-accent-3)" }}
                        >
                          Size
                        </label>
                        <Input
                          placeholder="M, L, etc"
                          value={newVariant.size}
                          onChange={(e) =>
                            setNewVariant({
                              ...newVariant,
                              size: e.target.value,
                            })
                          }
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            borderColor: "var(--palette-accent-3)",
                            color: "var(--palette-text)",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          className="text-xs font-semibold mb-1 block"
                          style={{ color: "var(--palette-accent-3)" }}
                        >
                          Color
                        </label>
                        <Input
                          placeholder="Red, Blue"
                          value={newVariant.color}
                          onChange={(e) =>
                            setNewVariant({
                              ...newVariant,
                              color: e.target.value,
                            })
                          }
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            borderColor: "var(--palette-accent-3)",
                            color: "var(--palette-text)",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          className="text-xs font-semibold mb-1 block"
                          style={{ color: "var(--palette-accent-3)" }}
                        >
                          Price
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={newVariant.price}
                          onChange={(e) =>
                            setNewVariant({
                              ...newVariant,
                              price: parseFloat(e.target.value) || 0,
                            })
                          }
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            borderColor: "var(--palette-accent-3)",
                            color: "var(--palette-text)",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          className="text-xs font-semibold mb-1 block"
                          style={{ color: "var(--palette-accent-3)" }}
                        >
                          Discount Price
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={newVariant.discountPrice}
                          onChange={(e) =>
                            setNewVariant({
                              ...newVariant,
                              discountPrice: parseFloat(e.target.value) || 0,
                            })
                          }
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            borderColor: "var(--palette-accent-3)",
                            color: "var(--palette-text)",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          className="text-xs font-semibold mb-1 block"
                          style={{ color: "var(--palette-accent-3)" }}
                        >
                          Stock
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={newVariant.stock}
                          onChange={(e) =>
                            setNewVariant({
                              ...newVariant,
                              stock: parseFloat(e.target.value) || 0,
                            })
                          }
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            borderColor: "var(--palette-accent-3)",
                            color: "var(--palette-text)",
                          }}
                        />
                      </div>

                      <div>
                        <label
                          className="text-xs font-semibold mb-1 block"
                          style={{ color: "var(--palette-accent-3)" }}
                        >
                          Recommended (Optional)
                        </label>
                        <Input
                          placeholder="e.g., Use this variant"
                          value={newVariant.recommended || ""}
                          onChange={(e) =>
                            setNewVariant({
                              ...newVariant,
                              recommended: e.target.value,
                            })
                          }
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            borderColor: "var(--palette-accent-3)",
                            color: "var(--palette-text)",
                          }}
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          className="text-xs font-semibold mb-2 block"
                          style={{ color: "var(--palette-accent-3)" }}
                        >
                          Variant Image (Optional)
                        </label>

                        {!newVariant.image?.url ? (
                          <div
                            className="relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-white/5 transition-colors"
                            style={{ borderColor: "var(--palette-accent-3)" }}
                          >
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handelUploadImage(file);
                                }
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              disabled={isImageUploading}
                            />
                            <div className="flex flex-col items-center gap-2">
                              <Upload
                                size={32}
                                style={{ color: "var(--palette-accent-3)" }}
                              />
                              <p
                                className="text-sm font-medium"
                                style={{ color: "var(--palette-accent-3)" }}
                              >
                                {isImageUploading
                                  ? "Uploading..."
                                  : "Click to upload variant image"}
                              </p>
                              <p
                                className="text-xs"
                                style={{
                                  color: "var(--palette-accent-3)",
                                  opacity: 0.7,
                                }}
                              >
                                PNG, JPG, WEBP up to 5MB
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="relative rounded-lg border p-2"
                            style={{
                              borderColor: "var(--palette-accent-3)",
                              backgroundColor: "rgba(255, 255, 255, 0.05)",
                            }}
                          >
                            <div className="relative w-full h-32">
                              <img
                                src={newVariant.image.url}
                                alt="Variant preview"
                                className="w-full h-full object-cover rounded"
                              />
                              <button
                                onClick={handleRemoveImage}
                                className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full transition"
                                type="button"
                              >
                                <X size={16} className="text-white" />
                              </button>
                            </div>
                            <p
                              className="text-xs mt-2 text-center"
                              style={{ color: "var(--palette-accent-3)" }}
                            >
                              Image uploaded ✓
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={handleAddVariant}
                      className="flex items-center gap-2 text-white"
                      style={{ backgroundColor: "var(--palette-btn)" }}
                    >
                      <Plus size={18} />
                      Add Variant
                    </Button>
                  </div>

                  {/* Variants List */}
                  {variants.length > 0 && (
                    <div>
                      <h3
                        className="font-semibold mb-3"
                        style={{ color: "var(--palette-accent-1)" }}
                      >
                        Added Variants ({variants.length})
                      </h3>
                      <div className="space-y-2">
                        {variants.map((variant, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 rounded-lg gap-3"
                            style={{
                              borderColor: "var(--palette-accent-3)",
                              backgroundColor: "rgba(255, 255, 255, 0.02)",
                              border: "1px solid",
                            }}
                          >
                            {/* Variant Image Preview */}
                            {variant.image?.url && (
                              <div className="flex-shrink-0">
                                <img
                                  src={variant.image.url}
                                  alt={`${variant.size} ${variant.color}`}
                                  className="w-16 h-16 object-cover rounded border"
                                  style={{
                                    borderColor: "var(--palette-accent-3)",
                                  }}
                                />
                              </div>
                            )}

                            <div className="flex-1">
                              <p className="font-medium">
                                {variant.size} - {variant.color}
                              </p>
                              <p
                                className="text-sm"
                                style={{ color: "var(--palette-accent-3)" }}
                              >
                                ৳{variant.price}
                                {variant.discountPrice &&
                                  ` → ৳${variant.discountPrice}`}{" "}
                                | Stock: {variant.stock}
                                {variant.sku && ` | SKU: ${variant.sku}`}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setNewVariant({
                                  color: variant?.color,
                                  price: variant?.price,
                                  size: variant?.size,
                                  stock: variant?.stock,
                                  recommended: variant?.recommended,
                                  discountPrice: variant?.discountPrice,
                                  sku: variant?.sku,
                                  image: variant?.image,
                                });
                                handleRemoveVariant(index);
                              }}
                              className="p-2 hover:bg-red-500/20 rounded transition"
                            >
                              <Pen size={18} className="text-red-400" />
                            </button>
                            <button
                              onClick={() => handleRemoveVariant(index)}
                              className="p-2 hover:bg-red-500/20 rounded transition"
                            >
                              <Trash2 size={18} className="text-red-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Auto-Calculated Prices */}
                  <div
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: "rgba(255, 107, 122, 0.1)",
                      borderColor: "var(--palette-btn)",
                      border: "1px solid",
                    }}
                  >
                    <h3
                      className="font-semibold mb-3"
                      style={{ color: "var(--palette-accent-1)" }}
                    >
                      Auto-Calculated Prices
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span style={{ color: "var(--palette-accent-3)" }}>
                          Avg Price:
                        </span>
                        <Input
                          type="number"
                          value={formData?.price}
                          onChange={(e) =>
                            updateField("price", parseInt(e.target.value))
                          }
                        />
                        {/* <p className="font-semibold text-lg">
                          ৳{formData?.price}
                        </p> */}
                      </div>
                      {formData?.offerPrice && (
                        <div>
                          <span style={{ color: "var(--palette-accent-3)" }}>
                            Avg Offer:
                          </span>
                          <Input
                            type="number"
                            value={formData?.offerPrice}
                            onChange={(e) =>
                              updateField(
                                "offerPrice",
                                parseInt(e.target.value)
                              )
                            }
                          />
                          {/*    <p
                            className="font-semibold text-lg"
                            style={{ color: "var(--palette-btn)" }}
                          >
                            ৳{avgOfferPrice}
                          </p> */}
                        </div>
                      )}
                      <div>
                        <span style={{ color: "var(--palette-accent-3)" }}>
                          Total Stock:
                        </span>
                        <p className="font-semibold text-lg">{totalStock}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* MEDIA SECTION */}
          <div
            className="rounded-lg border"
            style={{
              borderColor: "var(--palette-accent-3)",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
            }}
          >
            <button
              onClick={() => toggleSection("media")}
              className="w-full p-4 flex justify-between items-center hover:bg-white/5 transition"
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                🖼️ Media
              </h2>
              {expandedSections.media ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>

            {expandedSections.media && (
              <div
                className="p-4 border-t space-y-4"
                style={{ borderColor: "var(--palette-accent-3)" }}
              >
                {/* Thumbnail */}
                <div>
                  <h3
                    className="font-semibold mb-3"
                    style={{ color: "var(--palette-accent-1)" }}
                  >
                    Product Thumbnail
                  </h3>
                  {formData.thumbnail && (
                    <img
                      src={formData.thumbnail.url}
                      alt="Thumbnail"
                      className="w-24 h-24 object-cover rounded-lg mb-3"
                    />
                  )}
                  <ImageUploadFieldUpdate
                    label="Change Thumbnail"
                    isThumbnail={true}
                    onImagesSelected={(images) => {
                      if (images.length > 0)
                        updateField("thumbnail", images[0]);
                    }}
                  />
                </div>

                {/* Product Images */}
                <div>
                  <h3
                    className="font-semibold mb-3"
                    style={{ color: "var(--palette-accent-1)" }}
                  >
                    Product Images
                  </h3>
                  {images.length > 0 && (
                    <div>
                      <p
                        className="text-sm font-medium mb-3"
                        style={{ color: "var(--palette-accent-1)" }}
                      >
                        Uploaded Images ({images.length}) - Drag to reorder
                      </p>
                      <ReactSortable
                        id="images-grid"
                        list={images}
                        setList={(newOrder) => updateField("images", newOrder)}
                        className="grid grid-cols-4 gap-3"
                        animation={200}
                        handle=".drag-handle"
                        itemClass="sortable-item"
                        group="images"
                        style={{ touchAction: "none" }}
                      >
                        {images.map((img, index) => (
                          <div
                            key={`${img.id || img.key}-${index}`}
                            className="w-full h-24 relative sortable-item"
                          >
                            <div
                              className="w-full h-24 cursor-grab active:cursor-grabbing rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border-2 border-transparent hover:border-blue-400 group relative drag-handle"
                              style={{
                                touchAction: "none",
                                userSelect: "none",
                              }}
                            >
                              {/* Drag handle - unchanged */}
                              <div className="absolute top-1 right-1 w-6 h-6 bg-blue-500/80 hover:bg-blue-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10 cursor-grab active:cursor-grabbing">
                                <svg
                                  className="w-4 h-4 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 8h16M4 16h16"
                                  />
                                </svg>
                              </div>

                              <img
                                src={img.url}
                                alt={`Product image ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                                draggable={false}
                              />

                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                <span className="text-white text-xs font-medium px-2 py-1 bg-black/50 rounded">
                                  Drag ↕️
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </ReactSortable>
                    </div>
                  )}

                  <ImageUploadFieldUpdate
                    label="Add More Images"
                    isThumbnail={false}
                    onImagesSelected={(images) => {
                      updateField("images", images);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* SHIPPING SECTION */}
          <div
            className="rounded-lg border"
            style={{
              borderColor: "var(--palette-accent-3)",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
            }}
          >
            <button
              onClick={() => toggleSection("shipping")}
              className="w-full p-4 flex justify-between items-center hover:bg-white/5 transition"
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                🚚 Shipping
              </h2>
              {expandedSections.shipping ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>

            {expandedSections.shipping && (
              <div
                className="p-4 border-t space-y-4"
                style={{ borderColor: "var(--palette-accent-3)" }}
              >
                {/* Shipping Method */}
                <div className="space-y-3">
                  <div
                    className="p-4 rounded-lg cursor-pointer transition"
                    style={{
                      backgroundColor: !formData.freeShipping
                        ? "rgba(255, 107, 122, 0.1)"
                        : "rgba(255, 255, 255, 0.02)",
                      borderColor: !formData.freeShipping
                        ? "var(--palette-btn)"
                        : "var(--palette-accent-3)",
                      border: "1px solid",
                    }}
                    onClick={() => updateField("freeShipping", false)}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={!formData.freeShipping}
                        onChange={() => updateField("freeShipping", false)}
                      />
                      <div>
                        <p className="font-semibold">Paid Shipping</p>
                        <p
                          className="text-sm"
                          style={{ color: "var(--palette-accent-3)" }}
                        >
                          Charge customers for shipping
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="p-4 rounded-lg cursor-pointer transition"
                    style={{
                      backgroundColor: formData.freeShipping
                        ? "rgba(34, 197, 94, 0.1)"
                        : "rgba(255, 255, 255, 0.02)",
                      borderColor: formData.freeShipping
                        ? "rgb(34, 197, 94)"
                        : "var(--palette-accent-3)",
                      border: "1px solid",
                    }}
                    onClick={() => updateField("freeShipping", true)}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={formData.freeShipping}
                        onChange={() => updateField("freeShipping", true)}
                      />
                      <div>
                        <p className="font-semibold">Free Shipping</p>
                        <p
                          className="text-sm"
                          style={{ color: "var(--palette-accent-3)" }}
                        >
                          Offer free shipping
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Cost */}
                {!formData.freeShipping && (
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: "var(--palette-accent-1)" }}
                    >
                      Shipping Cost (৳)
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.shippingCost || 0}
                      onChange={(e) =>
                        updateField(
                          "shippingCost",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderColor: "var(--palette-accent-3)",
                        color: "var(--palette-text)",
                      }}
                    />
                  </div>
                )}

                {/* Shipping Time */}
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "var(--palette-accent-1)" }}
                  >
                    Estimated Shipping Time
                  </label>
                  <Input
                    placeholder="e.g., 2-3 business days"
                    value={formData.shippingTime || ""}
                    onChange={(e) =>
                      updateField("shippingTime", e.target.value)
                    }
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderColor: "var(--palette-accent-3)",
                      color: "var(--palette-text)",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ADDITIONAL INFO SECTION */}
          <div
            className="rounded-lg border"
            style={{
              borderColor: "var(--palette-accent-3)",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
            }}
          >
            <button
              onClick={() => toggleSection("additional")}
              className="w-full p-4 flex justify-between items-center hover:bg-white/5 transition"
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                ℹ️ Additional Information
              </h2>
              {expandedSections.additional ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>

            {expandedSections.additional && (
              <div
                className="p-4 border-t space-y-4"
                style={{ borderColor: "var(--palette-accent-3)" }}
              >
                {/* Dimensions */}
                <div>
                  <h3
                    className="font-semibold mb-3"
                    style={{ color: "var(--palette-accent-1)" }}
                  >
                    Dimensions
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label
                        className="text-xs font-semibold mb-1 block"
                        style={{ color: "var(--palette-accent-3)" }}
                      >
                        Height (cm)
                      </label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.height || 0}
                        onChange={(e) =>
                          updateField("height", parseFloat(e.target.value) || 0)
                        }
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          borderColor: "var(--palette-accent-3)",
                          color: "var(--palette-text)",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        className="text-xs font-semibold mb-1 block"
                        style={{ color: "var(--palette-accent-3)" }}
                      >
                        Width (cm)
                      </label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.width || 0}
                        onChange={(e) =>
                          updateField("width", parseFloat(e.target.value) || 0)
                        }
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          borderColor: "var(--palette-accent-3)",
                          color: "var(--palette-text)",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        className="text-xs font-semibold mb-1 block"
                        style={{ color: "var(--palette-accent-3)" }}
                      >
                        Weight (kg)
                      </label>
                      <Input
                        placeholder="0.5"
                        value={formData.weight || ""}
                        onChange={(e) => updateField("weight", e.target.value)}
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          borderColor: "var(--palette-accent-3)",
                          color: "var(--palette-text)",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        className="text-xs font-semibold mb-1 block"
                        style={{ color: "var(--palette-accent-3)" }}
                      >
                        Size
                      </label>
                      <Input
                        placeholder="M"
                        value={formData.size || ""}
                        onChange={(e) => updateField("size", e.target.value)}
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          borderColor: "var(--palette-accent-3)",
                          color: "var(--palette-text)",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Warranty & Return */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: "var(--palette-accent-1)" }}
                    >
                      Warranty Period
                    </label>
                    <Input
                      placeholder="12 months"
                      value={formData.warrantyPeriod || ""}
                      onChange={(e) =>
                        updateField("warrantyPeriod", e.target.value)
                      }
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderColor: "var(--palette-accent-3)",
                        color: "var(--palette-text)",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: "var(--palette-accent-1)" }}
                    >
                      Return Policy
                    </label>
                    <Input
                      placeholder="30 days"
                      value={formData.returnPolicy || ""}
                      onChange={(e) =>
                        updateField("returnPolicy", e.target.value)
                      }
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderColor: "var(--palette-accent-3)",
                        color: "var(--palette-text)",
                      }}
                    />
                  </div>
                </div>

                {/* Specifications */}
                <div>
                  <h3
                    className="font-semibold mb-3"
                    style={{ color: "var(--palette-accent-1)" }}
                  >
                    Specifications
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          className="text-xs font-semibold mb-1 block"
                          style={{ color: "var(--palette-accent-3)" }}
                        >
                          Key
                        </label>
                        <Input
                          placeholder="Material"
                          value={newSpec.key}
                          onChange={(e) =>
                            setNewSpec({ ...newSpec, key: e.target.value })
                          }
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            borderColor: "var(--palette-accent-3)",
                            color: "var(--palette-text)",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          className="text-xs font-semibold mb-1 block"
                          style={{ color: "var(--palette-accent-3)" }}
                        >
                          Value
                        </label>
                        <Input
                          placeholder="Cotton"
                          value={newSpec.value}
                          onChange={(e) =>
                            setNewSpec({ ...newSpec, value: e.target.value })
                          }
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            borderColor: "var(--palette-accent-3)",
                            color: "var(--palette-text)",
                          }}
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleAddSpec}
                      className="flex items-center gap-2 text-white w-full"
                      style={{ backgroundColor: "var(--palette-btn)" }}
                    >
                      <Plus size={18} />
                      Add Specification
                    </Button>
                  </div>

                  {Object.keys(formData.specifications || {}).length > 0 && (
                    <div className="space-y-2 mt-4">
                      {Object.entries(
                        formData.specifications as Record<string, string>
                      ).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center p-3 rounded-lg"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.02)",
                            borderColor: "var(--palette-accent-3)",
                            border: "1px solid",
                          }}
                        >
                          <div>
                            <p className="font-medium">{key}</p>
                            <p
                              className="text-sm"
                              style={{ color: "var(--palette-accent-3)" }}
                            >
                              {value}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveSpec(key)}
                            className="p-2 hover:bg-red-500/20 rounded transition"
                          >
                            <Trash2 size={18} className="text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Certifications */}
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "var(--palette-accent-1)" }}
                  >
                    Certifications (comma-separated)
                  </label>
                  <Input
                    placeholder="ISO 9001, CE Certified"
                    value={
                      (formData.certifications as string[])?.join(", ") || ""
                    }
                    onChange={(e) =>
                      updateField(
                        "certifications",
                        e.target.value.split(",").map((c) => c.trim())
                      )
                    }
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderColor: "var(--palette-accent-3)",
                      color: "var(--palette-text)",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div
          className="flex justify-end gap-3 mt-8 pt-6 border-t"
          style={{ borderColor: "var(--palette-accent-3)" }}
        >
          <Link href="/admin/my-products">
            <Button
              variant="outline"
              style={{ borderColor: "var(--palette-accent-3)" }}
            >
              Cancel
            </Button>
          </Link>
          <Button
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex items-center gap-2 text-white"
            style={{ backgroundColor: "var(--palette-btn)" }}
          >
            <Save size={20} />
            {isSubmitting ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
