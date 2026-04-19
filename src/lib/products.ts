export type Product = {
  id: string;
  name: string;
  originalPrice: number;
  onlinePrice: number;
  codPrice: number;
  cardImage: string;
  maxQuantity: number;
  currency: string;
  currencySymbol: string;
  shortDescription?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "luwia-prime",
    name: "Luwia Prime - for women (Skin brightening & Repair)",
    originalPrice: 850,
    onlinePrice: 680,
    codPrice: 750,
    cardImage: "/images/luwia_women_with_pack.jpeg",
    maxQuantity: 10,
    currency: "INR",
    currencySymbol: "₹",
    shortDescription: "Advanced formula designed specifically for women's skin brightening and repair.",
  },
  {
    id: "luwia-core",
    name: "Luwia Core - for men (Skin brightening & Repair)",
    originalPrice: 850,
    onlinePrice: 680,
    codPrice: 750,
    cardImage: "/images/luwia_men_with_pack.jpeg",
    maxQuantity: 10,
    currency: "INR",
    currencySymbol: "₹",
    shortDescription: "Potent formulation tailored for men's tough skin to brighten and repair.",
  },
  {
    id: "luwia-combo",
    name: "Luwia ultimate Combo - for Men and Women",
    originalPrice: 1700,
    onlinePrice: 1149,
    codPrice: 1500,
    cardImage: "/images/luwia_combo.jpeg",
    maxQuantity: 10,
    currency: "INR",
    currencySymbol: "₹",
    shortDescription: "The ultimate skin care bundle for both men and women. Get the best of both worlds.",
  },
];
