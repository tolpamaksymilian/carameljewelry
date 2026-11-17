import type { Metadata } from "next";
import { DuoCards } from "@/components/home/DuoCards";
import { Hero } from "@/components/home/Hero";
import { Stones } from "@/components/home/Stones";
import { Studio } from "@/components/home/Studio";
import { Works } from "@/components/home/Works";
import { JsonLd } from "@/components/site/JsonLd";
import { SectionDivider } from "@/components/site/Ornaments";
import { PRACE_NA_GLOWNEJ, WYROZNIONA, WYROZNIONA_PRACA } from "@/lib/prace";
import { listaPracLd, meta } from "@/lib/seo";
import { HERO_BLUR } from "@/lib/zdjecia.generated";

export const metadata: Metadata = meta({
  title: "Caramel Jewelry - ręcznie robiona biżuteria z koralików",
  description:
    "Ręcznie robiona biżuteria z koralików i kamieni naturalnych: naszyjniki, bransoletki i zestawy. Każdy koralik nawlekam ręcznie - także na zamówienie.",
  path: "/",
});

/** Strona główna. */
export default function HomePage() {
  return (
    <>
      <Hero wyrozniona={WYROZNIONA} praca={{ slug: WYROZNIONA_PRACA.slug, nazwa: WYROZNIONA_PRACA.nazwa }} blur={HERO_BLUR} />
      <DuoCards />
      <Works prace={PRACE_NA_GLOWNEJ} />
      <SectionDivider pull />
      <Stones />
      <SectionDivider pull />
      <Studio />
      <JsonLd data={listaPracLd(PRACE_NA_GLOWNEJ, { nazwa: "Ręcznie zrobione - wybrane prace", path: "/" })} />
    </>
  );
}
