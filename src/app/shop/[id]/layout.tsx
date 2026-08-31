import { PRODUCTS } from "@/lib/products";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return {
      title: "Product Not Found | Luwia Skin Science",
    };
  }

  return {
    title: `Luwia Skin Science — ${product.name}`,
    description: product.shortDescription || product.tagline || `Buy ${product.name} at Luwia Skin Science.`,
    openGraph: {
      title: `Luwia Skin Science — ${product.name}`,
      description: product.shortDescription || product.tagline || `Buy ${product.name} at Luwia Skin Science.`,
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
