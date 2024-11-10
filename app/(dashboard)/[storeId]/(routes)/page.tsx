import { getGraphTotalRevenue } from "@/actions/get-graph-total-tevenue";
import { getTotalProducts } from "@/actions/get-total-products";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getOrderTotalRevenueByCategory } from "@/actions/get-total-revenue-by-category";
import { getOrderPaymentStatusTotalRevenue } from "@/actions/get-total-revenue-by-order-status.ts";
import { getOrderStatusTotalRevenue } from "@/actions/get-total-revenue-order-status";
import { getTotalSales } from "@/actions/get-total-sales";
import { Heading } from "@/components/heading";
import Overview from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatter } from "@/lib/utils";
import { WalletCards } from "lucide-react";

interface DashboardOverviewProps {
  params: { storeId: string };
}

const DashboardOverview = async ({ params }: DashboardOverviewProps) => {
  const totalRevenue = await getTotalRevenue(params.storeId);
  const totalSales = await getTotalSales(params.storeId);
  const totalProducts = await getTotalProducts(params.storeId);
  const monthlyGraphRevenue = await getGraphTotalRevenue(params.storeId);
  const revenueByOrderStatus = await getOrderStatusTotalRevenue(params.storeId);
  const revenueBycategory = await getOrderTotalRevenueByCategory(
    params.storeId
  );
  const orderStatusTotalRevenue = await getOrderPaymentStatusTotalRevenue(
    params.storeId
  );

  return (
    <div className="flex-col" dir="rtl">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="לוח בקרה" description="סקירה כללית של החנות שלך" />

        <Separator />

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="col-span-2">
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle className="text-sm font-medium">סה״כ הכנסות</CardTitle>
              <WalletCards className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle className="text-sm font-medium">מכירות</CardTitle>
              <WalletCards className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{totalSales}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle className="text-sm font-medium">מוצרים</CardTitle>
              <WalletCards className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{totalProducts}</div>
            </CardContent>
          </Card>

          <Card className="col-span-2 lg:col-span-3">
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle className="text-sm font-medium">
                הכנסות לפי חודש
              </CardTitle>
              <WalletCards className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Overview data={monthlyGraphRevenue} />
            </CardContent>
          </Card>

          <Card className="col-span-2 sm:col-span-1">
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle className="text-sm font-medium">
                הכנסות לפי סטטוס תשלום
              </CardTitle>
              <WalletCards className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Overview data={orderStatusTotalRevenue} />
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle className="text-sm font-medium">
                הכנסות לפי קטגוריה
              </CardTitle>
              <WalletCards className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Overview data={revenueBycategory} />
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader className="flex items-center justify-between flex-row">
              <CardTitle className="text-sm font-medium">
                הכנסות לפי סטטוס הזמנה
              </CardTitle>
              <WalletCards className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Overview data={revenueByOrderStatus} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
