import React from "react";
import { Package, Clock, DollarSign } from "lucide-react";

const charges = [
  {
    area: "Same City / District",
    subtitle: "Fastest local delivery",
    data: [
      { weight: "≤ 500 g", time: "24 hrs", charge: "৳60" },
      { weight: "500 g – 1 kg", time: "24 hrs", charge: "৳70" },
      { weight: "1 – 2 kg", time: "24 hrs", charge: "৳90" },
      { weight: "> 2 kg", time: "—", charge: "+৳15/kg" },
    ],
  },
  {
    area: "Dhaka Metro → Nearby Areas",
    subtitle: "Within metro region",
    data: [
      { weight: "≤ 500 g", time: "72 hrs", charge: "৳80" },
      { weight: "500 g – 1 kg", time: "72 hrs", charge: "৳100" },
      { weight: "1 – 2 kg", time: "72 hrs", charge: "৳130" },
      { weight: "> 2 kg", time: "—", charge: "+৳25/kg" },
    ],
  },
  {
    area: "Dhaka/Suburbs ↔ Outside Dhaka",
    subtitle: "Cross-regional delivery",
    data: [
      { weight: "≤ 500 g", time: "72 hrs", charge: "৳110" },
      { weight: "500 g – 1 kg", time: "72 hrs", charge: "৳130" },
      { weight: "1 – 2 kg", time: "72 hrs", charge: "৳170" },
      { weight: "> 2 kg", time: "—", charge: "+৳25/kg" },
    ],
  },
  {
    area: "Outside Dhaka ↔ Outside Dhaka",
    subtitle: "Inter-district shipping",
    data: [
      { weight: "≤ 500 g", time: "72 hrs", charge: "৳120" },
      { weight: "500 g – 1 kg", time: "72 hrs", charge: "৳145" },
      { weight: "1 – 2 kg", time: "72 hrs", charge: "৳180" },
      { weight: "> 2 kg", time: "—", charge: "+৳25/kg" },
    ],
  },
];

export default function PathaoChargeTable() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 mb-4">
          <Package className="w-7 h-7 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Delivery Charges
        </h2>
        <p className="text-gray-500">
          Transparent pricing for every destination
        </p>
      </div>

      {/* Zones Grid */}
      <div className="grid gap-8 mb-12">
        {charges.map((zone, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* Zone Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {zone.area}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">{zone.subtitle}</p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-3 text-left">
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                        <Package className="w-4 h-4" />
                        Weight
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                        <Clock className="w-4 h-4" />
                        Delivery
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Charge
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {zone.data.map((row, i) => (
                    <tr
                      key={i}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {row.weight}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {row.time}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-50 text-emerald-700">
                          {row.charge}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
    </div>
  );
}
