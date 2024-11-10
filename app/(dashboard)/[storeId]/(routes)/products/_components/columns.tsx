"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Check, X } from "lucide-react";
import { CellAction } from "./cell-actions";

export type ProductColumns = {
  id: string;
  name: string;
  price: string;
  isFeatured: boolean;
  isArchived: boolean;
  category: string;
  images: { url: string }[];
  createdAt: string;
};

export const columns: ColumnDef<ProductColumns>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          שם
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    align: "right", // Add alignment property
  },
  {
    accessorKey: "price",
    header: "מחיר",
    align: "right",
  },
  {
    accessorKey: "isFeatured",
    header: "פופולרי",
    align: "center",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.original.isFeatured ? (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="h-4 w-4" />
            <span className="text-xs">פופולרי</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="text-xs">רגיל</span>
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "isArchived",
    header: "מלאי",
    align: "center",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.original.isArchived ? (
          <div className="flex items-center gap-2 text-red-600">
            <X className="h-4 w-4" />
            <span className="text-xs">אזל</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="h-4 w-4" />
            <span className="text-xs">במלאי</span>
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "קטגוריה",
    align: "right",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          תאריך
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    align: "right",
  },
  {
    id: "actions",
    align: "center",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
