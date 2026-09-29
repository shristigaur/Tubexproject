import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { TrustStrip, DarkFeature, SellerBuyer, Safety, CTA, Footer } from "@/components/sections";
import { Marketplace } from "@/components/marketplace"

export default function Home(){
 return <><SiteHeader/><main><Hero/><TrustStrip/><Marketplace/><DarkFeature/><SellerBuyer/><Safety/><CTA/></main><Footer/></>;
}
