import "./global.css";
import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Nunito } from "next/font/google";
import TanstackProvider from "@_providers/TanstackProvider";
import { RTOProviders } from "@_providers/RTOProviders";
import { headers } from "next/headers";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const inter = Inter({ subsets: ["latin"] });

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: { default: "Rider App", template: "%s | Rider App" },
  description: "Generated by create next app",
};

// export async function generateMetadata({ params, searchParams }: any): Promise<Metadata> {
//   const headersList = headers();
//   console.log(headersList)
//   return {
//     title: `Flowerstore | Rider App`,
//   }
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
        <body className={nunito.className}>
          <TanstackProvider>
            <RTOProviders>
              {children}
              <ToastContainer />
            </RTOProviders>
          </TanstackProvider>
        </body>
      </html>
  );
}
