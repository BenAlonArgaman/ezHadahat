import { db } from "@/lib/firebase";
import { Category, Cuisine, Kitchen, Product, Size } from "@/types-db";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { ProductForm } from "./_components/product-form";

const ProductPage = async ({
  params,
}: {
  params: {
    productId: string;
    storeId: string;
  };
}) => {
  const product = (
    await getDoc(
      doc(db, "stores", params.storeId, "products", params.productId)
    )
  ).data() as Product;

  const categoriesData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "categories"))
  ).docs.map((doc) => doc.data()) as Category[];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm initialData={product} categories={categoriesData} />
      </div>
    </div>
  );
};

export default ProductPage;
