import {
  Check,
  CircleDashed,
  Clock,
  Package,
  Scissors,
  Shirt,
} from "lucide-react";
import { OrderHistory } from "@/types";

// Mapping Icon berdasarkan kata kunci judul
const getIcon = (title: string, isActive: boolean) => {
  const className = `w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`;

  if (
    title.toLowerCase().includes("potong") ||
    title.toLowerCase().includes("cutting")
  )
    return <Scissors className={className} />;
  if (
    title.toLowerCase().includes("jahit") ||
    title.toLowerCase().includes("produksi")
  )
    return <Shirt className={className} />;
  if (
    title.toLowerCase().includes("packing") ||
    title.toLowerCase().includes("emas")
  )
    return <Package className={className} />;
  if (
    title.toLowerCase().includes("selesai") ||
    title.toLowerCase().includes("kirim")
  )
    return <Check className={className} />;
  return <Clock className={className} />;
};

export default function TrackingTimeline({
  histories,
}: {
  histories: OrderHistory[];
}) {
  if (!histories || histories.length === 0) {
    return (
      <div className="text-center text-gray-400 py-10">
        Belum ada riwayat status.
      </div>
    );
  }

  return (
    <div className="relative pl-4">
      {histories.map((step, index) => {
        const isLast = index === histories.length - 1; // Status paling baru (paling bawah)

        return (
          <div key={step.id} className="relative pb-10 last:pb-0">
            {/* Garis Vertikal */}
            {index !== histories.length - 1 && (
              <div className="absolute top-8 left-[19px] -ml-px h-full w-0.5 bg-gray-200" />
            )}

            <div className="relative flex items-start space-x-4">
              {/* Icon Circle */}
              <div
                className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 
                ${
                  isLast
                    ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-200"
                    : "bg-white border-gray-200"
                }`}
              >
                {getIcon(step.title, isLast)}
              </div>

              {/* Text Content */}
              <div className="min-w-0 flex-1 pt-1.5">
                <div className="flex justify-between text-sm mb-1">
                  <h3
                    className={`font-bold ${
                      isLast ? "text-blue-700 text-lg" : "text-gray-900"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono text-right">
                    {new Date(step.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <p
                  className={`text-sm ${
                    isLast ? "text-gray-700 font-medium" : "text-gray-500"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
