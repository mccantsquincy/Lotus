"use client";

import useScrollToTop  from "@/hooks/use-scroll-top";

import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

const Navbar = () => {
    const scrolled = useScrollToTop();

    return ( 
        <div className={cn("z-50 bg-background fixed top-0 flex items-center w-full p-6 gap-4", scrolled && "border-b shadow-sm")}>
            <Logo />
            <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
              Login
            </div>
            <ModeToggle />
        </div>
     );
}
 
export default Navbar;