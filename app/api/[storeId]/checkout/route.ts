import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { Product } from "@/types-db";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const OPTIONS = async () => {
  return NextResponse.json({}, { headers: corsHeaders });
};

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { products, userId, phone, address } = await req.json();

    // Calculate total order amount
    const totalAmount = products.reduce((sum: number, item: Product) => {
      return sum + item.price * (item.qty || 1);
    }, 0);

    // Create order data
    const orderData = {
      isPaid: false, // Set to true since we're skipping payment
      orderItems: products,
      phone,
      address,
      userId,
      order_status: "Processing", // Changed from "Processing" to "Confirmed"
      totalAmount,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Add the order to Firestore
    const orderRef = await addDoc(
      collection(db, "stores", params.storeId, "orders"),
      orderData
    );

    // Update the document with its ID
    const id = orderRef.id;
    await updateDoc(doc(db, "stores", params.storeId, "orders", id), {
      ...orderData,
      id,
    });

    // Return success response with order details
    return NextResponse.json(
      {
        success: true,
        orderId: id,
        message: "Order created successfully",
        orderDetails: {
          id,
          ...orderData,
          createdAt: new Date().toISOString(), // Convert timestamp for response
          updatedAt: new Date().toISOString(),
        },
      },
      {
        headers: corsHeaders,
        status: 201,
      }
    );
  } catch (error) {
    console.error("[ORDER_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong.",
      },
      {
        headers: corsHeaders,
        status: 500,
      }
    );
  }
};
