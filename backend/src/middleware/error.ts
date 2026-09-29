import type { ErrorRequestHandler } from "express";
export const notFound=(req:any,res:any)=>res.status(404).json({success:false,message:`Route ${req.method} ${req.originalUrl} not found`});
export const errorHandler:ErrorRequestHandler=(err,_req,res,_next)=>{
 console.error(err);
 res.status(err?.statusCode ?? 500).json({success:false,message:process.env.NODE_ENV==="production"?"Something went wrong":"Internal server error"});
};
