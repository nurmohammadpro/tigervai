import { useMutation } from "@tanstack/react-query";
import { uploadCategory, UploadMultipleImage } from "@/actions/brand-category";
import { toast } from "sonner";

export const useUploadSingleImage = () => {
  return useMutation({
    mutationKey: ["uploadCategory"],
    mutationFn: (formData: FormData) => uploadCategory(formData),
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error.message);
        return;
      }
      toast.success("Uploaded successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Unknown error");
    },
  });
};
export const useUploadMultipleImage = () => {
  return useMutation({
    mutationKey: ["uploadCategory"],
    mutationFn: (formData: FormData) => UploadMultipleImage(formData),
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error.message);
        return;
      }
      toast.success("Uploaded successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Unknown error");
    },
    
  });

};
