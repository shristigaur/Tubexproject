import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", {
  variants: { variant: { default:"bg-primary text-primary-foreground hover:-translate-y-0.5 hover:shadow-lg", outline:"border border-border bg-white hover:bg-muted", ghost:"hover:bg-muted", accent:"bg-accent text-accent-foreground hover:-translate-y-0.5 hover:shadow-lg" }, size:{ default:"h-11 px-5", sm:"h-9 px-4 text-xs", lg:"h-14 px-7 text-base" } },
  defaultVariants:{variant:"default",size:"default"}
});
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants>{asChild?:boolean}
export function Button({className,variant,size,asChild=false,...props}:ButtonProps){const Comp=asChild?Slot:"button";return <Comp className={cn(buttonVariants({variant,size,className}))}{...props}/>}
