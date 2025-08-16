import { notFound } from "next/navigation";
import ProductClient from "./product-client";
import { products } from "@/data/products";

// Sólo permitir rutas generadas en build (requerido para output: 'export')
export const dynamicParams = false;

// Genera todas las rutas estáticas a partir del catálogo
export function generateStaticParams(): { id: string }[] {
  return products.map((p) => ({ id: p.id }));
}

// (opcional) Metadata por producto
export function generateMetadata({ params }: { params: { id: string } }) {
  const prod = products.find((p) => p.id === params.id);
  return {
    title: prod ? `${prod.name} | 2MyLover` : "Producto | 2MyLover",
  };
}

// NOTA: usa el tipo inline { params: { id: string } } (no declares un type Props)
export default function Page({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);
  if (!product) return notFound();
  return <ProductClient product={product} />;
}
