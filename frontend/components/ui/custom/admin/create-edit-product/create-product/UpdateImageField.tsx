import React, { useCallback, useState } from "react";
import { X, Upload } from "lucide-react";
import { toast } from "sonner";
import { useAddProductStore } from "@/zustan-hook/addProductStore";
import {
  useUploadMultipleImage,
  useUploadSingleImage,
} from "@/lib/useHandelImageUpload";
import { useApiMutation } from "@/api-hook/react-query-wrapper";
import { DeleteImage } from "@/actions/brand-category";
import { useEditProductStore } from "@/zustan-hook/editProductStore";

interface ImageUploadFieldProps {
  onImagesSelected: (
    images: Array<{ url: string; key: string; id: string }>
  ) => void;
  maxFiles?: number;
  label?: string;
  isThumbnail?: boolean;
}

export const ImageUploadFieldUpdate: React.FC<ImageUploadFieldProps> = ({
  onImagesSelected,
  maxFiles = 5,
  label = "Upload Images",
  isThumbnail = false,
}) => {
  const [dragActive, setDragActive] = useState(false);

  const { formData, loadProduct, updateField, getChangedFields } =
    useEditProductStore();
  const { mutate: UploadThumbnail, isPending: isThumbnailPending } =
    useUploadSingleImage();
  const { mutate: UploadMultipleImage } = useUploadMultipleImage();

  const handleFiles = useCallback(
    (files: FileList) => {
      if (isThumbnail) {
        const file = files[0];
        if (!file) return toast.error("Please select a file");
        const loadingUpload = toast.loading("Uploading thumbnail...");
        const fromData = new FormData();
        fromData.append("file", file);
        UploadThumbnail(fromData, {
          onSuccess: (data) => {
            if (data?.error) {
              toast.error(data.error.message);
            }
            updateField("thumbnail", {
              url: data?.data?.url as string,
              key: data?.data?.key as string,
              id: data?.data?.key as string,
            });
            toast.dismiss(loadingUpload);
          },
          onError: (error) => {
            toast.error(error.message || "Unknown error");
            toast.dismiss(loadingUpload);
          },
        });

        return;
      }
      const loadingUpload = toast.loading("Uploading Images...");

      const newFiles = Array.from(files).slice(
        0,
        maxFiles - (isThumbnail ? 0 : formData?.images?.length ?? 0)
      );

      const fromData = new FormData();

      newFiles.forEach((file) => {
        fromData.append("files", file);
      });
      UploadMultipleImage(fromData, {
        onSuccess: (data) => {
          if (data?.error) {
            toast.error(data.error.message);
          }
          const dataReturn =
            data?.data?.map((item) => ({
              ...item,
              url: item.url,
              key: item.key,
              id: item.key,
            })) ?? [];
          const fullImages = [...(formData?.images ?? []), ...dataReturn];
          updateField("images", fullImages);
          toast.dismiss(loadingUpload);
        },
        onError: (error) => {
          toast.error(error.message || "Unknown error");
          toast.dismiss(loadingUpload);
        },
      });
    },
    [
      maxFiles,
      isThumbnail,
      UploadThumbnail,
      updateField,
      formData,
      UploadMultipleImage,
    ]
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const { mutate: RemoveImage, isPending } = useApiMutation(
    DeleteImage,
    undefined,
    "DeleteImage"
  );

  const removeImage = (index: string) => {
    RemoveImage(index);
    if (isThumbnail) {
      updateField("thumbnail", null);
      return;
    }
    const images = formData?.images ?? [];
    updateField(
      "images",
      images.filter((k, i) => k?.id !== index)
    );
  };

  return (
    <div className="w-full">
      <label
        className="block text-sm font-medium mb-2"
        style={{ color: "var(--palette-text)" }}
      >
        {label}
      </label>

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          dragActive
            ? "border-[var(--palette-btn)] bg-[var(--palette-btn)]/10"
            : "border-[var(--palette-accent-3)]"
        }`}
        style={{
          backgroundColor: dragActive
            ? "rgba(255, 107, 122, 0.1)"
            : "transparent",
        }}
      >
        <input
          type="file"
          multiple={!isThumbnail}
          onChange={handleChange}
          accept="image/*"
          className="hidden"
          id={isThumbnail ? "thumbnail-upload" : "images-upload"}
        />

        <label
          htmlFor={isThumbnail ? "thumbnail-upload" : "images-upload"}
          className="cursor-pointer"
        >
          <Upload
            className="mx-auto h-12 w-12 mb-2"
            style={{ color: "var(--palette-btn)" }}
          />
          <p
            className="text-sm font-medium"
            style={{ color: "var(--palette-text)" }}
          >
            Drag and drop {isThumbnail ? "image" : "images"} here, or click to
            select
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "var(--palette-accent-3)" }}
          >
            {isThumbnail ? "1" : `Up to ${maxFiles}`} image
            {!isThumbnail ? "s" : ""} supported
          </p>
        </label>
      </div>
      {isThumbnail
        ? formData.thumbnail && (
            <div
              className={`mt-4 grid gap-4 ${
                isThumbnail ? "grid-cols-1" : "grid-cols-2 md:grid-cols-4"
              }`}
            >
              <div
                key={formData?.thumbnail?.id}
                className="relative group rounded-lg overflow-hidden"
                style={{ backgroundColor: "var(--palette-bg)" }}
              >
                <img
                  src={formData?.thumbnail?.url}
                  alt={`Preview ${formData?.thumbnail?.key}`}
                  className="w-full h-32 object-cover"
                />
                <button
                  onClick={() => removeImage(formData?.thumbnail?.id!)}
                  className="absolute top-1 right-1 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            </div>
          )
        : (formData?.images?.length ?? 0) > 0 && (
            <div
              className={`mt-4 grid gap-4 ${
                isThumbnail ? "grid-cols-1" : "grid-cols-2 md:grid-cols-4"
              }`}
            >
              {formData?.images?.map((item, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden"
                  style={{ backgroundColor: "var(--palette-bg)" }}
                >
                  <img
                    src={item.url}
                    alt={`Preview ${index}`}
                    className="w-full h-32 object-cover"
                  />
                  <button
                    onClick={() => removeImage(item.id!)}
                    className="absolute top-1 right-1 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

      {/* Preview Grid */}
    </div>
  );
};
