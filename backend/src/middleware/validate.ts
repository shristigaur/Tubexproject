import type { RequestHandler } from "express";
import { ZodType } from "zod";
export const validate=(schema:ZodType):RequestHandler=> (req,res,next)=>{
 const parsed=schema.safeParse(req.body);
 if(!parsed.success){res.status(400).json({success:false,message:"Validation failed",errors:parsed.error.flatten()});return;}
 req.body=parsed.data; next();
};
