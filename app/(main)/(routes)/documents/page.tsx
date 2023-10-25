"use client";
// note change work image to empty image

import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";

const DocumentsPage = () => {
    const { user } = useUser();
    const create = useMutation(api.documents.create);

    const onCreate = () => {
      const promise = create({ title: "Untitled" });

      toast.promise(promise, {
        loading: "Creating a new note...",
        success: "New note ctreated!",
        error: "Failed to create a new note."
      });
    };

    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Image 
               src="/work.png"
               height="300"
               width="300"
               alt="working"
            />
            <h2 className="text-lg font-md">
                Welcome to {user?.firstName}&apos;s Lotus workspace
            </h2>
            <Button onClick={onCreate}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create a note  
            </Button>
        </div>
    )
}

export default DocumentsPage;