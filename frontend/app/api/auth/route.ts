import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const userInfo = cookieStore.get("user_info")?.value;
  return Response.json(
    userInfo ? JSON.parse(userInfo) : null
  );
}
