// OrdersClient.tsx with RTL support
"use client";
import { Heading } from "@/components/heading";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { OrdersColumns, columns } from "./columns";

interface OrdersClientProps {
  data: OrdersColumns[];
}

export const OrdersClient = ({ data }: OrdersClientProps) => {
  return (
    <div dir="rtl" className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <Heading
          title={`הזמנות (${data.length})`}
          description="ניהול הזמנות החנות שלך"
        />
      </div>
      <Separator className="mb-6" />
      <div className="overflow-x-auto">
        <DataTable searchKey="products" columns={columns} data={data} />
      </div>
    </div>
  );
};
