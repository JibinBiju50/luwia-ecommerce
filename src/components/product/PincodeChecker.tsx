"use client";

import { useState } from "react";
import { Truck, CheckCircle2, AlertCircle } from "lucide-react";

export default function PincodeChecker() {
  const [pincode, setPincode] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const checkDelivery = () => {
    if (pincode.length !== 6 || isNaN(Number(pincode))) {
      setDeliveryMessage({ text: "Please enter a valid 6-digit pincode.", type: "error" });
      return;
    }

    const prefix3 = pincode.substring(0, 3);

    // Expanded Metro List: Delhi (110), Mumbai (400), Bangalore (560), Chennai (600), Kolkata (700), Hyderabad (500), Pune (411), Ahmedabad (380), Ernakulam/Kochi (682)
    const metros = ["110", "400", "560", "600", "700", "500", "411", "380", "682"];

    if (metros.includes(prefix3)) {
      setDeliveryMessage({ text: "Estimated Delivery: 2 - 3 Days", type: "success" });
    } else {
      setDeliveryMessage({ text: "Estimated Delivery: 3 - 5 Days", type: "success" });
    }
  };

  return (
    <div className="mt-4 w-full bg-[#f7ecf2] border border-brand-primary/20 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Truck className="w-4 h-4 text-brand-primary" />
        <h3 className="text-xs font-bold text-brand-text">Check Delivery Estimate</h3>
      </div>
      
      <div className="flex gap-2 sm:gap-3 w-full">
        <input
          type="text"
          maxLength={6}
          placeholder="Enter Pincode"
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value.replace(/\D/g, ""));
            setDeliveryMessage(null);
          }}
          className="flex-1 min-w-0 h-10 px-2 sm:px-4 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary/50 transition-all bg-white"
        />
        <button
          onClick={checkDelivery}
          disabled={pincode.length !== 6}
          className="h-10 px-4 sm:px-6 text-xs font-semibold text-brand-primary bg-white border border-brand-primary/30 rounded-lg hover:bg-brand-primary/5 hover:border-brand-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shrink-0"
        >
          Check
        </button>
      </div>

      {deliveryMessage && (
        <div className={`mt-3 flex items-start gap-1.5 text-xs font-semibold p-2.5 rounded-lg bg-white/60 border ${deliveryMessage.type === "error" ? "text-red-600 border-red-100" : "text-green-700 border-green-100"}`}>
          {deliveryMessage.type === "error" ? (
            <AlertCircle className="w-4 h-4 mt-0 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 mt-0 shrink-0" />
          )}
          <span>{deliveryMessage.text}</span>
        </div>
      )}
    </div>
  );
}
