import { ProductWorkspaceLayout } from "@/components/layout/ProductWorkspaceLayout";

export default function ProductLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ProductWorkspaceLayout>{children}</ProductWorkspaceLayout>;
}
