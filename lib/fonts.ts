import { Cormorant_Garamond, Jost } from "next/font/google";

/** Krój szeryfowy — logo, nagłówki, cytaty. Fonty są pobierane przy budowaniu i hostowane lokalnie. */
export const serif = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

/** Minimalistyczny krój bezszeryfowy — podpisy, etykiety, przyciski. */
export const sans = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-sans",
});
