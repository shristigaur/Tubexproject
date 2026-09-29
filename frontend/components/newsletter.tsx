"use client";
import { FormEvent, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { api } from "@/lib/api";

export function Newsletter(){
 const [email,setEmail]=useState(""); const [state,setState]=useState<"idle"|"loading"|"done"|"error">("idle");
 async function submit(e:FormEvent){e.preventDefault();setState("loading");try{await api(`/api/newsletter`,{method:"POST",body:JSON.stringify({email})});setState("done");setEmail("");}catch{setState("error");}}
 return <div className="mt-7"><form onSubmit={submit} className="flex max-w-xl flex-col gap-3 sm:flex-row"><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="h-12 flex-1 rounded-full border bg-white px-5 text-sm outline-none focus:ring-2 focus:ring-[#7c5cff]"/><Button type="submit" disabled={state==="loading"}>{state==="loading"?<Loader2 className="animate-spin" size={16}/>:<ArrowRight size={16}/>} {state==="done"?"Subscribed":"Get marketplace updates"}</Button></form>{state==="error"&&<p className="mt-2 text-xs text-red-600">Could not subscribe. Make sure the backend is running.</p>}</div>
}
