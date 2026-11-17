import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/AdminApp";

export const metadata: Metadata = {
  title: { absolute: "Panel | Caramel Jewelry" },
  description: "Panel administracyjny Caramel Jewelry.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

/** /admin - logowanie do panelu. Cała logika działa w przeglądarce (strona jest eksportowana statycznie). */
export default function AdminPage() {
  return <AdminApp />;
}
