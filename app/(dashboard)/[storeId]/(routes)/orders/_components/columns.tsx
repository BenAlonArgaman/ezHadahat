"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { CellAction } from "./cell-actions";
import CellImage from "./cell-image";
import { cn } from "@/lib/utils";
import { useState } from "react";

export type OrdersColumns = {
  id: string;
  phone: string;
  address: string;
  products: string;
  totalPrice: string;
  images: string[];
  isPaid: boolean;
  createdAt: string;
  order_status: string;
};

const ExpandableCell = ({ content }: { content: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const products = content.split(", ").map((item) => {
    const match = item.match(/(.*?)\s*\((\d+)\)/);
    return match
      ? { name: match[1], quantity: match[2] }
      : { name: item, quantity: "1" };
  });

  const hasMore = products.length > 2;
  const displayProducts = isExpanded ? products : products.slice(0, 2);

  return (
    <div className="space-y-1">
      <div className="space-y-2">
        {displayProducts.map((product, index) => (
          <div
            key={index}
            className="text-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-1 pb-1 border-b last:border-b-0"
          >
            <span className="font-medium text-right line-clamp-2">
              <span className="text-gray-500 ml-[0.4rem] text-right whitespace-nowrap">
                {product.quantity}
              </span>
              {product.name}
            </span>
          </div>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 mt-2"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-3 w-3" />
              הצג פחות
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" />
              הצג עוד {products.length - 2} פריטים
            </>
          )}
        </button>
      )}
    </div>
  );
};

export const columns: ColumnDef<OrdersColumns>[] = [
  {
    accessorKey: "images",
    header: ({ column }) => <div className="text-right px-2">תמונות</div>,
    cell: ({ row }) => (
      <div className="flex gap-2 px-2">
        <CellImage data={row.original.images} />
      </div>
    ),
  },
  {
    accessorKey: "products",
    header: ({ column }) => <div className="text-right px-2">מוצרים</div>,
    cell: ({ row }) => (
      <div className="w-[180px] lg:w-[250px]">
        <ExpandableCell content={row.original.products} />
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => <div className="text-right px-2">טלפון</div>,
    cell: ({ row }) => (
      <div className="text-gray-700 text-right whitespace-nowrap px-2">
        {row.original.phone}
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: ({ column }) => <div className="text-right px-2">כתובת</div>,
    cell: ({ row }) => (
      <div className="w-[120px] lg:w-[200px] text-gray-700 text-right line-clamp-2 px-2">
        {row.original.address}
      </div>
    ),
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => <div className="text-right px-2">סכום</div>,
    cell: ({ row }) => (
      <div className="font-medium text-right whitespace-nowrap px-2">
        {row.original.totalPrice}
      </div>
    ),
  },
  {
    accessorKey: "order_status",
    header: ({ column }) => <div className="text-right px-2">סטטוס</div>,
    cell: ({ row }) => {
      const { order_status } = row.original;
      const statusStyles = {
        Delivering: "text-amber-700 bg-amber-50",
        Processing: "text-blue-700 bg-blue-50",
        Delivered: "text-emerald-700 bg-emerald-50",
        Canceled: "text-rose-700 bg-rose-50",
      };

      const statusText = {
        Delivering: "בהובלה",
        Processing: "בטיפול",
        Delivered: "נמסר",
        Canceled: "בוטל",
      };

      return (
        <div
          className={cn(
            "font-medium text-center whitespace-nowrap px-2 py-1 rounded-full text-sm",
            statusStyles[order_status as keyof typeof statusStyles]
          )}
        >
          {statusText[order_status as keyof typeof statusText]}
        </div>
      );
    },
  },
  {
    accessorKey: "isPaid",
    header: ({ column }) => <div className="text-right px-2">סטטוס תשלום</div>,
    cell: ({ row }) => {
      const { isPaid } = row.original;
      return (
        <div
          className={cn(
            "font-medium px-2 py-1 rounded-full text-sm text-center whitespace-nowrap",
            isPaid
              ? "text-emerald-700 bg-emerald-50"
              : "text-rose-700 bg-rose-50"
          )}
        >
          {isPaid ? "שולם" : "לא שולם"}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-right w-full px-2"
        >
          תאריך
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-gray-700 text-right whitespace-nowrap mr-4">
        {row.original.createdAt}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
