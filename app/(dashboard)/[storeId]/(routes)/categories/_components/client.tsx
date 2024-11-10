"use client";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CategoryColumns, columns } from "./columns";
import ApiList from "@/components/api-list";

interface CategoryClientProps {
  data: CategoryColumns[];
}

export const CategoryClient = ({ data }: CategoryClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <div dir="rtl" className="w-full px-4 md:px-8 space-y-4 md:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Heading
          title={`קטגוריות (${data.length})`}
          description="ניהול קטגוריות עבור החנות שלך"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/create`)}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 ml-2" />
          הוסף קטגוריה
        </Button>
      </div>

      <Separator className="my-4" />

      {/* Data Table */}
      <div className="rounded-md">
        <DataTable searchKey="name" columns={columns} data={data} />
      </div>
    </div>
  );
};
