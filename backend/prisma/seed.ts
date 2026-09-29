import { PrismaClient } from "@prisma/client";
const prisma=new PrismaClient();

async function main(){
 const seller=await prisma.user.upsert({where:{email:"demo@tubex.example"},update:{},create:{email:"demo@tubex.example",name:"TubeX Demo Seller",passwordHash:"seed-only",role:"USER"}});
 const items=[
  ["Finance Simplified","finance-simplified","Finance","United States",186000,1200000,12900,18],
  ["Pixel & Code","pixel-and-code","Technology","India",312000,2600000,31500,24],
  ["Kitchen Atlas","kitchen-atlas","Food","United Kingdom",94000,780000,7800,11]
 ] as const;
 for(const [title,slug,category,country,subscribers,monthlyViews,askingPrice,growthPercent] of items){
  await prisma.channel.upsert({where:{slug},update:{},create:{title,slug,category,country,subscribers,monthlyViews,askingPrice,growthPercent,description:`A ${category.toLowerCase()} YouTube channel listing on TubeX.`,verified:true,status:"PUBLISHED",sellerId:seller.id}});
 }
}
main().finally(()=>prisma.$disconnect());
