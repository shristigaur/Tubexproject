"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { api } from "@/lib/api";

let isGoogleInitialized = false;

export function GoogleAuthButton() {
  const [error, setError] = useState("");
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSuccess = async (response: any) => {
    try {
      setError("");
      const data = await api("/api/auth/google", {
        method: "POST",
        body: JSON.stringify({ credential: response.credential }),
      });
      router.push(data.user?.role === "SELLER" ? "/seller-dashboard" : "/explore-channels");
    } catch (err: any) {

      setError(err.message || "Google authentication failed.");
    }
  };

  useEffect(() => {
    // We attach it to window so the script can call it
    (window as any).onGoogleLibraryLoad = () => {
      const win = window as any;
      if (!isGoogleInitialized && win.google) {
        win.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
          callback: handleSuccess,
        });
        isGoogleInitialized = true;
      }
      if (containerRef.current && win.google) {
        win.google.accounts.id.renderButton(containerRef.current, {
          theme: "outline",
          size: "large",
          width: 320,
          text: "continue_with",
        });
      }
    };

    // If script is already loaded
    if ((window as any).google?.accounts?.id) {
      (window as any).onGoogleLibraryLoad();
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <Script 
        src="https://accounts.google.com/gsi/client" 
        strategy="afterInteractive" 
        onLoad={() => {
          if ((window as any).onGoogleLibraryLoad) {
            (window as any).onGoogleLibraryLoad();
          }
        }}
      />
      {error && <div className="text-red-600 text-sm mb-3 text-center">{error}</div>}
      <div className="w-full flex justify-center" ref={containerRef}></div>
    </div>
  );
}
