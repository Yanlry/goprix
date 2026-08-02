import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { CatalogHydration } from "@/components/common/CatalogHydration";
import { CartAddedDrawer } from "@/components/common/CartAddedDrawer";
import { AuthInit } from "@/components/common/AuthInit";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthInit />
      <CatalogHydration />
      <PublicHeader />
      <CartAddedDrawer />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </>
  );
}
