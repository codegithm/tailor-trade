import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function logHttpAction({
  method,
  route,
  status,
  requestBody,
  responseBody,
  error,
}: {
  method: string;
  route: string;
  status: number;
  requestBody?: any;
  responseBody?: any;
  error?: any;
}) {
  try {
    await fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method,
        route,
        status,
        requestBody: requestBody ? JSON.stringify(requestBody) : null,
        responseBody: responseBody ? JSON.stringify(responseBody) : null,
        error: error ? JSON.stringify(error) : null,
      }),
    });
  } catch (err) {
    // Optionally log to console if backend logging fails
    console.error("Frontend logHttpAction failed:", err);
  }
}
