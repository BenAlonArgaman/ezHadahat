import { db } from "@/lib/firebase";
import { collection, doc, getDocs } from "firebase/firestore";
import { format } from "date-fns";

import { ProductClient } from "./_components/client";
import { Product } from "@/types-db";
import { ProductColumns } from "./_components/columns";
import { formatter } from "@/lib/utils";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const productsData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "products"))
  ).docs.map((doc) => doc.data()) as Product[];

  const formattedProducts: ProductColumns[] = productsData.map((item) => ({
    id: item.id,
    name: item.name,
    price: formatter.format(item.price),
    isArchived: item.isArchived,
    isFeatured: item.isFeatured,
    category: item.category,
    size: item.size,
    cuisine: item.cuisine,
    kitchen: item.kitchen,
    images: item.images,
    createdAt: item.createdAt
      ? format(item.createdAt.toDate(), "dd.MM.yy")
      : "",
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
