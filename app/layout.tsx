import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Great_Vibes, Playfair_Display, Poppins } from "next/font/google";
import "../styles/globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap"
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["500", "600", "700"]
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-greatvibes",
  weight: ["400"]
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["500", "600", "700"]
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600"]
});

export const metadata: Metadata = {
  title: "Ritupurna & Abhisek | Engagement Invitation",
  description: "A cinematic luxury wedding invitation experience"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${cormorant.variable} ${cinzel.variable} ${greatVibes.variable} ${playfair.variable} ${poppins.variable} bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
