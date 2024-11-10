"use client";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

interface OverviewProps {
  data: any[];
}

const Overview = ({ data }: OverviewProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const hebrewTranslations: { [key: string]: string } = {
    Jan: "ינו׳",
    Feb: "פבר׳",
    Mar: "מרץ",
    Apr: "אפר׳",
    May: "מאי",
    Jun: "יוני",
    Jul: "יולי",
    Aug: "אוג׳",
    Sep: "ספט׳",
    Oct: "אוק׳",
    Nov: "נוב׳",
    Dec: "דצמ׳",
    Delivering: "שולח",
    Processing: "בטיפול",
    Delivered: "הושלם",
    Canceled: "בוטל",
    Paid: "שולם",
    "Not Paid": "לא שולם",
  };

  // Transform data and use abbreviated names for mobile
  const hebrewData = [...data].map((item) => ({
    ...item,
    name: hebrewTranslations[item.name] || item.name,
    total: Number(item.total),
  }));

  // For mobile, only show last 6 months if data length is greater than 6
  const displayData =
    isMobile && hebrewData.length > 6 ? hebrewData.slice(-6) : hebrewData;

  return (
    <div className="w-full" dir="rtl">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={displayData}
          margin={{
            top: 20,
            right: isMobile ? 0 : 25,
            left: isMobile ? 0 : 25,
            bottom: 20,
          }}
        >
          <XAxis
            dataKey="name"
            stroke="#555"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            interval={0}
            tick={{ fontSize: isMobile ? 10 : 12 }}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            stroke="#555"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Bar
            dataKey="total"
            fill="#84B74E"
            radius={[4, 4, 0, 0]}
            maxBarSize={isMobile ? 30 : 50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Overview;
