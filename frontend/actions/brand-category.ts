"use server"

import { DeleteRequestAxios, PatchRequestAxios, PostRequestAxios } from "@/api-hook/api-hook"

export const uploadCategory = async (formData: FormData) => {
  // ✅ Get the file from FormData
  const file = formData.get("file") as File | null;

  if (!file) {
    return { data: null, error: { message: "No file provided" } };
  }

  // ✅ Validate size (1 MB = 1 * 1024 * 1024 bytes)
  const MAX_SIZE = 1 * 1024 * 1024;

  if (file.size > MAX_SIZE) {
    return { data: null, error: { message: "File size cannot exceed 1 MB" } };
  }

  // ✅ Continue to upload
  const [data, error] = await PostRequestAxios<{ url: string; key: string }>(
    `/upload-service/single`,
    formData
  );

  return { data, error };
};
export const UploadMultipleImage = async (formData: FormData) => {
  // ✅ Get all files from FormData
  const files = formData.getAll("files") as File[];

  if (!files || files.length === 0) {
    return { data: null, error: { message: "No files provided" } };
  }

  // ✅ Validate each file size (1 MB = 1 * 1024 * 1024 bytes)
  const MAX_SIZE = 1 * 1024 * 1024;

  for (const file of files) {
    if (file.size > MAX_SIZE) {
      return { data: null, error: { message: `File ${file.name} exceeds 1 MB` } };
    }
  }

  // ✅ Continue to upload
  const [data, error] = await PostRequestAxios<{ url: string; key: string }[]>(
    `/upload-service/multiple`,
    formData
  );

  return { data, error };
};

export const DeleteImage = async (key: string) => {
  const [data, error] = await DeleteRequestAxios(`/upload-service/${key}`);
  return { data, error }
}




export const createCategory = async (payload: any) => {
  const [data, error] = await PostRequestAxios("/category", payload);
  return { data, error }
};
export const updateCategory = async (id:string,payload: any) => {
  const [data, error] = await PatchRequestAxios(`/category/${id}`, payload);
  return { data, error }
};

export const DeleteCategory = async (id:string) => {
  const [data, error] = await DeleteRequestAxios(`/category/${id}`);
  return { data, error }
};


export const postBrand = async (payload: any) => {
  const [data, error] = await PostRequestAxios("/brand", payload);
  return { data, error }
};
export const UpdateBrand = async (id:string,payload: any) => {
  const [data, error] = await PatchRequestAxios(`/brand/${id}`, payload);
  return { data, error }
};
export const DeleteBrand = async (id:string) => {
  const [data, error] = await DeleteRequestAxios(`/brand/${id}`);
  return { data, error }
};
