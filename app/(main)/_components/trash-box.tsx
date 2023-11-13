"Use client";

import { useState } from "react";

import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Spinner } from "@/components/spinner";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";


const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const documents = useQuery(api.documents.getTrash);
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);

  const [search, setSearch] = useState("");

  const filteredDocuments = documents?.filter((document) => {
    return document.title.toLowerCase().includes(search.toLowerCase());
  });

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`)
  };

  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<"documents">,
  ) => {
    event.stopPropagation();
    const promise = restore({ id: documentId });

    toast.promise(promise, {
        loading: "Resotring note...",
        success: "Note restored!",
        error: "Failed to restore note"
    })
  }

  const onRemove = (
    documentId: Id<"documents">,
  ) => {
    const promise = remove({ id: documentId });

    toast.promise(promise, {
        loading: "Deleted note...",
        success: "Note deleted!",
        error: "Failed to delete note"
    })

    if(params.documentId === documentId) {
        router.push('/documents');
    }
  }

  if(documents === undefined) {
    return (
        <div className="h-full items-center justify-center p-4">
            <Spinner size="lg" />
        </div>
    )
  }

  return (
    <div className="text-sm">
        <div className="flex items-center gap-x-1 p-2">
            <Search />
            <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
                placeholder="Filter by page title..."
            />
        </div>
    </div>
  );
};

export default TrashBox;
