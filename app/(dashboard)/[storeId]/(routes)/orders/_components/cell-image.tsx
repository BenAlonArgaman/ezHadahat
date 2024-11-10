// CellImage.tsx with expandable products
"use client";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CellImageProps {
  data: string[];
}

const CellImage = ({ data }: CellImageProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayImages = isExpanded ? data : data.slice(0, 2);
  const hasMore = data.length > 2;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {displayImages.map((url, index) => (
          <div
            key={index}
            className="relative w-14 h-14 rounded-lg border border-gray-100 overflow-hidden bg-gray-50"
          >
            <Image
              alt="Product"
              fill
              className="object-contain p-1"
              src={url}
            />
          </div>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-3 w-3" />
              הצג פחות
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" />
              הצג עוד {data.length - 2} תמונות
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default CellImage;
