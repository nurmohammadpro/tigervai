import { PostRequestAxios } from "@/api-hook/api-hook";

export const postNewSell = async (payload: any) => {
    const [data, error] = await PostRequestAxios("/sell-product-item", payload);
    return { data, error };
}