import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Header = () => {
    return ( 
        <div className="max-w-3xl space-y-4">
           <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
             Your personal workspace Unified. <span className="underline">Lotus</span>
           </h1>
           <h3 className="text-base sm:text-xl md:text-2xl font-medium">
            Productive, Organized, Efficient, and Free is what <br/> Lotus stands for.
           </h3>
           <Button>
             Use Lotus
             <ArrowRight className="h-4 w-4 ml-2"/>
           </Button>
        </div>
     );
}
 
export default Header;