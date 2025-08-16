export type Product = {
  id: string;            // usa slug estático
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  sizes: string[];
  colors: string[];
  images: string[];
  description: string;
  features: string[];
  isNew?: boolean;
  onSale?: boolean;
  rating: number;
  reviews: number;
  stock: number;
};

export const products: Product[] = [
  {
    id: "sueter-minimalista-negro",
    name: "Suéter Minimalista Negro",
    price: 89.99,
    originalPrice: 109.99,
    category: "sueteres",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Negro"],
    images: [
      "/minimalist-black-sweater.png",
      "/black-sweater-front.png",
      "/black-sweater-back-view.png",
      "/placeholder-guk1p.png"
    ],
    description:
      "Suéter minimalista de alta calidad confeccionado en algodón premium. Diseño atemporal que combina comodidad y estilo urbano.",
    features: [
      "100% Algodón orgánico",
      "Corte regular fit",
      "Cuello redondo",
      "Costuras reforzadas",
      "Lavable a máquina"
    ],
    isNew: true,
    onSale: true,
    rating: 4.8,
    reviews: 24,
    stock: 15
  }
  // Agrega más productos aquí...
];
