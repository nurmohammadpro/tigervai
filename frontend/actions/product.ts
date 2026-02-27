"use server"
import { GetRequestAxios, GetRequestNormal, PatchRequestAxios, PostRequestAxios } from "@/api-hook/api-hook";
import { revalidatePath, revalidateTag } from "next/cache";

export const postNewProduct = async (payload:any) => {
    const [data, error] = await PostRequestAxios("/product/create",payload)
    // Revalidate product-related caches
    revalidateTag("products")
    revalidatePath("/search-product")
    return {data, error}

}

export const updateProductAdmin = async ({id,payload}:{id:string,payload:any}) => {
    const [data, error] = await PatchRequestAxios(`/product/admin-update/${id}`,payload)
    // Revalidate product-related caches
    revalidateTag("products")
    revalidatePath("/search-product")
    return {data, error}

}
export const getBestProduct = async () => {
    const [data, error] = await GetRequestAxios(`/product/search?page=1&limit=10`)
    return {data, error}
    
}

