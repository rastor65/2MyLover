import { notFound } from "next/navigation";
import ProductClient from "./product-client";
import { products } from "@/data/products";

export const dynamicParams = false;

export function generateStaticParams(): Array<{ id: string }> {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prod = products.find((p) => p.id === id);
  return {
    title: prod ? `${prod.name} | 2MyLover` : "Producto | 2MyLover",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();
  return <ProductClient product={product} />;
}
