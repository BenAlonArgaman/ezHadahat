"use client";

import { useParams, useRouter } from "next/navigation";
import { OrdersColumns } from "./columns";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreVertical, Trash, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { AlertModal } from "@/components/modal/alert-modal";

interface CellActionProps {
  data: OrdersColumns;
}

export const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("מספר ההזמנה הועתק");
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/${params.storeId}/orders/${data.id}`);
      toast.success("ההזמנה נמחקה");
      location.reload();
      router.push(`/${params.storeId}/orders`);
    } catch (error) {
      toast.error("משהו השתבש");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  const onUpdate = async (data: any) => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/${params.storeId}/orders/${data.id}`, data);
      location.reload();
      router.push(`/${params.storeId}/orders`);
      toast.success("ההזמנה עודכנה");
    } catch (error) {
      toast.error("משהו השתבש");
    } finally {
      router.refresh();
      setIsLoading(false);
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
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0" variant="ghost">
            <span className="sr-only">פתח תפריט</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>פעולות</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="h-4 w-4 ml-2" />
            העתק מס' הזמנה
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => onUpdate({ id: data.id, isPaid: true })}
          >
            <CreditCard className="h-4 w-4 ml-2" />
            סמן כשולם
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onUpdate({ id: data.id, isPaid: false })}
          >
            <CreditCard className="h-4 w-4 ml-2" />
            סמן כלא שולם
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() =>
              onUpdate({ id: data.id, order_status: "Delivering" })
            }
          >
            <Edit className="h-4 w-4 ml-2" />
            בשליחה
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onUpdate({ id: data.id, order_status: "Delivered" })}
          >
            <Edit className="h-4 w-4 ml-2" />
            נשלח
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onUpdate({ id: data.id, order_status: "Canceled" })}
          >
            <Edit className="h-4 w-4 ml-2" />
            ביטול
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="text-red-600"
          >
            <Trash className="h-4 w-4 ml-2" />
            מחיקה
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
