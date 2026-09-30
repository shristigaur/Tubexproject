"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";


type Channel={id:string;title:string;category:string;country:string;subscribers:number;monthlyViews:number;askingPrice:number;growthPercent:number|null;verified:boolean};
const fallback:Channel[]=[
{id:"1",title:"Finance Simplified",category:"Finance",country:"United States",subscribers:186000,monthlyViews:1200000,askingPrice:12900,growthPercent:18,verified:true},
{id:"2",title:"Pixel & Code",category:"Technology",country:"India",subscribers:312000,monthlyViews:2600000,askingPrice:31500,growthPercent:24,verified:true},
{id:"3",title:"Kitchen Atlas",category:"Food",country:"United Kingdom",subscribers:94000,monthlyViews:780000,askingPrice:7800,growthPercent:11,verified:true}
];
const compact=(n:number)=>n>=1_000_000?`${(n/1_000_000).toFixed(1)}M`:n>=1_000?`${Math.round(n/1000)}K`:String(n);
export function Marketplace(){
  const [channels, setChannels] = useState<Channel[]>(fallback);
  useEffect(()=>{
    import('@/lib/api').then(({ api }) => {
      api('/api/channels/featured').then(x => {
        if (x?.data?.length) setChannels(x.data);
      }).catch(() => {});
    });
  }, []);
 return <section id="marketplace" className="py-24"><div className="container-x"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#7c5cff]">Explore the marketplace</p><h2 className="display mt-3 max-w-3xl text-5xl font-black sm:text-6xl">Find the right audience, not just a subscriber count.</h2></div><Button asChild variant="outline"><Link href="/explore-channels">View all listings <ArrowRight size={16}/></Link></Button></div><div className="mt-12 grid gap-5 lg:grid-cols-3">{channels.map(c=><Link key={c.id} href="/explore-channels"><Card className="overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-xl h-full"><div className="h-32 bg-[#151e2c] p-5"><div className="flex size-14 items-center justify-center rounded-2xl bg-[#ffcf4a] text-xl font-black">{c.title[0]}</div></div><div className="p-6"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{c.title}</h3><p className="mt-1 text-sm text-muted-foreground">{c.category} · {c.country}</p></div>{c.verified&&<BadgeCheck size={19} className="text-green-600"/>}</div><div className="mt-6 grid grid-cols-2 gap-3 text-sm"><div><span className="text-muted-foreground">Subscribers</span><b className="mt-1 block">{compact(c.subscribers)}</b></div><div><span className="text-muted-foreground">Monthly views</span><b className="mt-1 block">{compact(c.monthlyViews)}</b></div></div><div className="mt-6 flex items-center justify-between border-t pt-5"><div><span className="text-xs text-muted-foreground">Asking price</span><b className="mt-1 block text-lg">${c.askingPrice.toLocaleString()}</b></div>{c.growthPercent!==null&&<span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">+{c.growthPercent}% growth</span>}</div></div></Card></Link>)}</div></div></section>;
}
