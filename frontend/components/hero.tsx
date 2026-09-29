import { ArrowRight, CheckCircle2, Globe2, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero(){return <section className="hero-glow grid-bg overflow-hidden border-b border-border">
 <div className="container-x grid min-h-[650px] items-center gap-14 py-20 lg:grid-cols-[1.05fr_.95fr]">
  <div>
   <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-4 py-2 text-xs font-semibold shadow-sm"><Sparkles size={14}/> The global YouTube channel marketplace</div>
   <h1 className="display max-w-4xl text-6xl font-black sm:text-7xl lg:text-[88px]">Buy or sell a YouTube channel, <span className="text-[#7c5cff]">without the chaos.</span></h1>
   <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">Discover channels from creators around the world, compare real performance data, and move through a structured deal flow built for buyers and sellers.</p>
   <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Button asChild size="lg"><Link href="#marketplace">Browse channels <ArrowRight size={18}/></Link></Button><Button asChild size="lg" variant="outline"><Link href="#sell">List your channel</Link></Button></div>
   <div className="mt-9 grid max-w-xl grid-cols-3 gap-4 text-sm"><div><b className="block text-xl">Global</b><span className="text-muted-foreground">buyers & sellers</span></div><div><b className="block text-xl">Verified</b><span className="text-muted-foreground">listing signals</span></div><div><b className="block text-xl">Secure</b><span className="text-muted-foreground">deal workflow</span></div></div>
  </div>
  <div className="relative">
   <div className="absolute -inset-8 rounded-[50px] bg-[#7c5cff]/10 blur-3xl"/>
   <div className="relative rounded-[32px] border border-[#253143] bg-[#111a27] p-4 shadow-2xl">
    <div className="rounded-[24px] bg-[#f8f9f7] p-5">
      <div className="flex items-center justify-between"><div><p className="text-xs font-semibold text-muted-foreground">Featured listing</p><h3 className="mt-1 text-xl font-bold">TechCraft Daily</h3></div><span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">Verified</span></div>
      <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white p-4"><p className="text-xs text-muted-foreground">Subscribers</p><p className="mt-1 text-2xl font-black">428K</p></div><div className="rounded-2xl bg-white p-4"><p className="text-xs text-muted-foreground">Avg. monthly views</p><p className="mt-1 text-2xl font-black">3.8M</p></div></div>
      <div className="mt-3 rounded-2xl bg-white p-4"><div className="flex justify-between text-xs text-muted-foreground"><span>Category</span><span>Price</span></div><div className="mt-1 flex justify-between font-bold"><span>Technology</span><span>$24,500</span></div><div className="mt-5 h-24 overflow-hidden rounded-xl bg-[#f0f1ff] p-2"><div className="flex h-full items-end gap-1">{[30,45,36,58,50,70,64,82,74,92,86,100].map((h,i)=><div key={i} className="flex-1 rounded-t-md bg-[#7c5cff]" style={{height:`${h}%`}}/>)}</div></div></div>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck size={15} className="text-green-600"/> Ownership and listing details reviewed before publishing.</div>
    </div>
   </div>
  </div>
 </div>
</section>}
