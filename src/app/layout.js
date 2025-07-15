import { Inter } from "next/font/google";
import "./globals.css";
import { ReportsProvider } from "@/lib/ReportsContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: {
    default: 'DNAdmin',
    template: '%s | DNAdmin',
  },
  description: 'The DNA Company Admin Panel.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="icon.png" sizes="any"/>
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ReportsProvider>
          {children}
        </ReportsProvider>
      </body>
    </html>
  );
}
