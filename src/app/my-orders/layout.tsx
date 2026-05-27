import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders — Luwia Skin Science",
  description:
    "View and track all your Luwia Skin Science orders. Check order status, payment details, and products ordered.",
};

export default function MyOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
