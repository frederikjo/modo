import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Modo",
  description: "Lifestyle & Weight Loss App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-brand-light dark:bg-brand-dark text-brand-primary dark:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
