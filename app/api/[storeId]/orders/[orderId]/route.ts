import { db } from "@/lib/firebase";
import { Order } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; orderId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!params.orderId) {
      return new NextResponse("Order is required", { status: 400 });
    }

    // Extract both order_status and isPaid from body
    const { order_status, isPaid } = body;

    // Check if at least one of the fields is present
    if (order_status === undefined && isPaid === undefined) {
      return new NextResponse(
        "Either order status or payment status is required",
        { status: 400 }
      );
    }

    // Verify store ownership
    const store = await getDoc(doc(db, "stores", params.storeId));
    if (store.exists()) {
      let storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Unauthorized Access", { status: 403 });
      }
    }

    // Get the order reference
    const orderRef = doc(
      db,
      "stores",
      params.storeId,
      "orders",
      params.orderId
    );
    const orderDoc = await getDoc(orderRef);

    if (orderDoc.exists()) {
      // Prepare update data
      const updateData: any = {
        ...orderDoc.data(),
        updatedAt: serverTimestamp(),
      };

      // Only include fields that are provided in the request
      if (order_status !== undefined) {
        updateData.order_status = order_status;
      }

      if (isPaid !== undefined) {
        updateData.isPaid = isPaid;
      }

      // Update the document
      await updateDoc(orderRef, updateData);

      // Fetch and return updated order
      const updatedOrder = (await getDoc(orderRef)).data() as Order;
      return NextResponse.json(updatedOrder);
    } else {
      return new NextResponse("Order Not Found", { status: 404 });
    }
  } catch (error) {
    console.log(`[ORDER_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; orderId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!params.orderId) {
      return new NextResponse("Order is required", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));
    if (store.exists()) {
      let storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Unauthorized Access", { status: 403 });
      }
    }

    const docRef = doc(db, "stores", params.storeId, "orders", params.orderId);
    await deleteDoc(docRef);

    return NextResponse.json({ msg: "Order Deleted" });
  } catch (error) {
    console.log(`[ORDER_DELETE] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
