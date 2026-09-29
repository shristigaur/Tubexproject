import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

export async function health(_req:Request,res:Response){res.json({success:true,service:"tubex-api",time:new Date().toISOString()});}
export async function featuredChannels(_req:Request,res:Response){
 const channels=await prisma.channel.findMany({where:{status:"PUBLISHED"},orderBy:{createdAt:"desc"},take:6,select:{id:true,title:true,slug:true,category:true,country:true,subscribers:true,monthlyViews:true,askingPrice:true,growthPercent:true,verified:true}});
 res.json({success:true,data:channels});
}
export const newsletterSchema=z.object({email:z.string().email().max(254)});
export async function subscribe(req:Request,res:Response){
 const {email}=newsletterSchema.parse(req.body);
 await prisma.newsletterSubscriber.upsert({where:{email},update:{},create:{email}});
 res.status(201).json({success:true,message:"You are subscribed."});
}
