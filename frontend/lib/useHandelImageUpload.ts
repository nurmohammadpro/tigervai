import { useMutation } from "@tanstack/react-query";
import { uploadCategory, UploadMultipleImage } from "@/actions/brand-category";

export const useUploadSingleImage = () => {
  return useMutation({
    mutationKey: ["uploadSingleImage"],
    mutationFn: (formData: FormData) => uploadCategory(formData),
  });
};
export const useUploadMultipleImage = () => {
  return useMutation({
    mutationKey: ["uploadMultipleImages"],
    mutationFn: (formData: FormData) => UploadMultipleImage(formData),
  });
};
