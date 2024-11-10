"use client";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BillboardColumns, columns } from "./columns";
import ApiList from "@/components/api-list";

interface BillboardClientProps {
  data: BillboardColumns[];
}

export const BillboardClient = ({ data }: BillboardClientProps) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`באנרים (${data.length})`}
          description="נהל את הבאנרים באתר שלך"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/create`)}
        >
          הוסף חדש
          <Plus className="h-4 w-4 mr-2" />
        </Button>
      </div>

      <Separator />
      <DataTable searchKey="label" columns={columns} data={data} />
    </>
  );
};
