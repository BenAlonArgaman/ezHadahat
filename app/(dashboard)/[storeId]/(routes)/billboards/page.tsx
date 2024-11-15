import React from "react";
import { db } from "@/lib/firebase";
import { collection, doc, getDocs } from "firebase/firestore";
import { format } from "date-fns";
import { BillboardClient } from "./_components/client";
import { Billboards } from "@/types-db";
import { BillboardColumns } from "./_components/columns";

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const billboardsData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "billboards"))
  ).docs.map((doc) => doc.data()) as Billboards[];

  const formattedBillboards: BillboardColumns[] = billboardsData.map(
    (item) => ({
      id: item.id,
      label: item.label,
      imageUrl: item.imageUrl,
      createdAt: item.createdAt
        ? format(item.createdAt.toDate(), "dd.MM.yy")
        : "",
    })
  );

  return (
    <div className="flex-col" dir="rtl">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
