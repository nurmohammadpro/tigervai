"use server"
import { GetRequestAxios, PatchRequestAxios, PostRequestAxios, DeleteRequestAxios } from "@/api-hook/api-hook";
import { revalidatePath } from "next/cache";

export const postNewProduct = async (payload:any) => {
    const [data, error] = await PostRequestAxios("/product/create",payload)
    // Revalidate product-related caches
    revalidatePath("/")
    revalidatePath("/search-product")
    return {data, error}

}

export const updateProductAdmin = async ({id,payload}:{id:string,payload:any}) => {
    const [data, error] = await PatchRequestAxios(`/product/admin-update/${id}`,payload)
    // Revalidate product-related caches
    revalidatePath("/")
    revalidatePath("/search-product")
    return {data, error}

}
export const getBestProduct = async () => {
    const [data, error] = await GetRequestAxios(`/product/search?page=1&limit=10`)
    return {data, error}

}

export const deleteProduct = async (id: string) => {
    const [data, error] = await DeleteRequestAxios(`/product?id=${id}`)
    // Revalidate product-related caches including homepage
    revalidatePath("/")
    revalidatePath("/search-product")
    return {data, error}
}

