"use server"

import { LoginResponse } from "@/@types/auth-response";
import { BasicUser } from "@/@types/userType";
import { GetRequestNormal, PostRequestAxios } from "@/api-hook/api-hook";
import { refresh, revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const loginUser = async (email:string,password:string)=>{


    const payload ={email,password}
    const [data,error] = await PostRequestAxios<LoginResponse>(`/user/login-user`,payload);
    console.log("data-user-login->",data,"error-user-login->",error);
    
    console.log("data-user-login->",data,"error-user-login->",error);
    if(data?.access_token){
        const userInfo ={
          
            id:data?.user._id,
            email:data?.user.email,
            role:data?.user.role,
            name:data?.user.name,
            address:data?.user.address,
            shopLogo:data?.user.shopLogo,
            shopAddress:data?.user.shopAddress,
            shopName:data?.user.shopName,
            slug:data?.user.slug,
            phone:data?.user.phone,

        }
     const coookies = await cookies()
      coookies.set("access_token",data?.access_token,{maxAge:60*60*24*60,path:'/'});
      coookies.set("refresh_token",data?.refresh_token,{maxAge:60*60*24*30,path:'/'})
      coookies.set("user_info",JSON.stringify(userInfo),{maxAge:60*60*24*60,path:'/'})
    
    }
 
    return {data,error}
}

export const loginWithGoogle = async (idToken:string)=>{


    const payload ={idToken}
    const [data,error] = await PostRequestAxios<LoginResponse>(`/user/login-user-with-google`,payload);
    console.log("data-user-login->",data,"error-user-login->",error);
    
    console.log("data-user-login->",data,"error-user-login->",error);
    if(data?.access_token){
        const userInfo ={
          
            id:data?.user._id,
            email:data?.user.email,
            role:data?.user.role,
            name:data?.user.name,
            address:data?.user.address,
            shopLogo:data?.user.shopLogo,
            shopAddress:data?.user.shopAddress,
            shopName:data?.user.shopName,
            slug:data?.user.slug,
            phone:data?.user.phone,

        }
     const coookies = await cookies()
      coookies.set("access_token",data?.access_token,{maxAge:60*60*24*60,path:'/'});
      coookies.set("refresh_token",data?.refresh_token,{maxAge:60*60*24*30,path:'/'})
      coookies.set("user_info",JSON.stringify(userInfo),{maxAge:60*60*24*60,path:'/'})
    
    }
 
    return {data,error}
}


export const SignUpUser = async (payload: any) => {
  const [data, error] = await PostRequestAxios("/user/create-user", payload);
  return { data, error };
};



export const getUserInfo = async ():Promise<BasicUser | null>  => {
  const coookies = await cookies()
  const userInfo = coookies.get("user_info")?.value 
  return userInfo ? JSON.parse(userInfo) : null
}

export const logOut = async (currentPath?: string) => {
  const cookieStore = await cookies();
  
  // Delete cookies
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  cookieStore.delete("user_info");
  return true
  // ✅ If on home page, revalidate it; otherwise redirect to home
  if (currentPath === "/") {
    revalidatePath("/");
  } else {
    redirect("/");
  }
}

export const AmIAuthenticated = async () => {
 const response = await GetRequestNormal<{data:boolean,message:string}>(`/user/am-i-authenticated`)
 return response
}