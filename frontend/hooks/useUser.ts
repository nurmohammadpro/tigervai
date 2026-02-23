"use client";
import { useQuery } from "@tanstack/react-query";

// Fetch from your API route that returns user info
async function fetchUserInfo() {
  return fetch("/api/auth", { credentials: "include" }).then(res => res.json());
}

export function useUser() {
  return useQuery({
    queryKey: ["user-info"],
    queryFn: fetchUserInfo,
  });
}
