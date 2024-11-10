"use client";

import { useParams, useRouter } from "next/navigation";
import { BillboardColumns } from "./columns";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreVertical, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/lib/firebase";
import axios from "axios";
import { AlertModal } from "@/components/modal/alert-modal";

interface CellActionProps {
  data: BillboardColumns;
}

export const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Billboard id copied to clipboard");
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await deleteObject(ref(storage, data.imageUrl)).then(async () => {
        await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
      });
      //   router.refresh();
      location.reload();
      router.push(`/${params.storeId}/billboards`);
      toast.success("Billboard Removed");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isLoading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0" variant={"ghost"}>
            <span className="sr-only">Open</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent style={{ direction: "rtl" }} align="start">
          <DropdownMenuLabel>פעולות</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            העתק מזהה
            <Copy className="h-4 w-4 mr-2" />
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              router.push(`/${params.storeId}/billboards/${data.id}`)
            }
          >
            עדכון
            <Edit className="h-4 w-4 mr-2" />
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpen(true)}>
            מחק
            <Trash className="h-4 w-4 mr-2" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
