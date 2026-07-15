import { PRODUCT } from "./product";

export type Product = {
  id: string;
  name: string;
  originalPrice: number;
  onlinePrice: number;
  codPrice: number;
  cardImage: string;
  image: string;
  gallery: string[];
  maxQuantity: number;
  currency: string;
  currencySymbol: string;
  shortDescription?: string;
  description: string;
  tagline?: string;
  benefits: { emoji: string; text: string }[];
  ingredients: { name: string; description: string }[];
  usage?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "luwia-prime",
    name: "Luwia Prime - for women (Skin brightening & Repair)",
    originalPrice: 849,
    onlinePrice: 649,
    codPrice: 699,
    cardImage: "/images/luwia_women_with_pack.jpeg",
    image: "/images/luwia_women_with_pack.jpeg",
    gallery: [
      "/images/Brightening face cream_.jpeg",
      "/images/luwia_women_with_pack.jpeg",
      "/images/luwia_women_2.jpeg",
      "/images/face_img_2.jpeg",
      "/images/product_img_poster.jpeg",
      "/images/active_ingredients_img.jpeg",
      "/images/HowToUse Women_page-0001.jpg",
      "/images/tested_and_loved_img.jpeg",
      "/images/trusted_by_real_users_img.jpeg",
    ],
    maxQuantity: 10,
    currency: "INR",
    currencySymbol: "₹",
    shortDescription: "Advanced formula designed specifically for women's skin brightening and repair.",
    description: PRODUCT.description,
    tagline: "Glow confidently. Glow with Luwia Prime.",
    benefits: [
      { emoji: "🌸", text: "Brightens and evens skin tone" },
      { emoji: "💧", text: "Deeply moisturizes and nourishes skin" },
      { emoji: "✨", text: "Fades dark spots and pigmentation" },
      { emoji: "🌿", text: "Improves skin texture and smoothness" },
      { emoji: "🛡️", text: "Helps repair and protect skin barrier" },
    ],
    ingredients: PRODUCT.ingredients,
    usage: PRODUCT.usage,
  },
  {
    id: "luwia-core",
    name: "Luwia Core - for Men (Skin brightening and Repair)",
    originalPrice: 849,
    onlinePrice: 649,
    codPrice: 699,
    cardImage: "/images/luwia_men_with_pack.jpeg",
    image: "/images/luwia_men_with_pack.jpeg",
    gallery: [
      "/images/luwia_men_with_pack.jpeg",
      "/images/luwia_men_2.jpeg",
      "/images/face_img_1.jpeg",
      "/images/active_ingredients_img.jpeg",
      "/images/HowToUse Men_page-0001.jpg",
      "/images/tested_and_loved_img.jpeg",
      "/images/trusted_by_real_users_img.jpeg",
    ],
    maxQuantity: 10,
    currency: "INR",
    currencySymbol: "₹",
    shortDescription: "Potent formulation tailored for men's tough skin to brighten and repair.",
    description: PRODUCT.description,
    tagline: "Glow confidently. Glow with Luwia Core.",
    benefits: [
      { emoji: "💪", text: "Tackles tough skin and uneven tone" },
      { emoji: "🌟", text: "Visibly reduces tan and dullness" },
      { emoji: "✨", text: "Brightens and evens skin tone" },
      { emoji: "🌿", text: "Improves skin texture and smoothness" },
      { emoji: "🛡️", text: "Helps repair and protect skin barrier" },
    ],
    ingredients: PRODUCT.ingredients,
    usage: PRODUCT.usage,
  },
  {
    id: "luwia-combo",
    name: "Luwia ultimate Combo - for Men and Women",
    originalPrice: 1699,
    onlinePrice: 1199,
    codPrice: 1199,
    cardImage: "/images/luwia_combo.jpeg",
    image: "/images/luwia_combo.jpeg",
    gallery: [
      "/images/luwia_combo.jpeg",
      "/images/luwia_combo_2.jpeg",
      "/images/men_skin.jpeg",
      "/images/girl_skin.jpeg",
      "/images/product_img_poster.jpeg",
      "/images/active_ingredients_img.jpeg",
      "/images/HowToUse Women_page-0001.jpg",
      "/images/HowToUse Men_page-0001.jpg",
      "/images/tested_and_loved_img.jpeg",
      "/images/trusted_by_real_users_img.jpeg",
    ],
    maxQuantity: 10,
    currency: "INR",
    currencySymbol: "₹",
    shortDescription: "The ultimate skin care bundle for both men and women. Get the best of both worlds.",
    description: `Get the best of both worlds with the Luwia Ultimate Combo — Luwia Prime for women and Luwia Core for men, bundled together at an exclusive price.

Both creams harness the power of Glutathione, Niacinamide, Kojic Acid, and other premium actives to deliver radiant, brightened, and healthy skin for everyone.

Perfect as a couple's skincare routine or as a thoughtful gift. One formula for her, one for him — both designed to transform your skin from the inside out.`,
    tagline: "His & Hers. One Glow. Ultimate Combo.",
    benefits: [
      { emoji: "👫", text: "Perfect for couples — his & hers formula" },
      { emoji: "🌟", text: "Visibly reduces tan and dullness" },
      { emoji: "✨", text: "Brightens and evens skin tone" },
      { emoji: "💧", text: "Deeply moisturizes and nourishes skin" },
      { emoji: "🛡️", text: "Helps repair and protect skin barrier" },
    ],
    ingredients: PRODUCT.ingredients,
    usage: PRODUCT.usage,
  },
];
