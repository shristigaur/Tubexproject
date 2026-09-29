const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export async function api(
  endpoint: string,
  options: RequestInit = {}
) {
  let response: Response;
  try {
    response = await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      }
    );
  } catch (error: any) {
    // This catches network errors, DNS errors, or CORS errors (where browser blocks the request)
    console.error("API Fetch Error:", error);
    throw new Error("Unable to connect to the server. Please check your connection or try again later.");
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }
    throw new Error("Failed to parse server response");
  }

  if (!response.ok) {
    throw new Error(data.message || `Server error: ${response.status}`);
  }

  return data;
}