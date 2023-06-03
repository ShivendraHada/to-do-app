import { Nunito } from "@next/font/google";
import "./globals.css";
import Modal from "@/components/Modal";

const nunito = Nunito({
  subsets: ["latin"],
});

export const metadata = {
  title: "To-do App",
  description:
    "Effortlessly Navigate Your Personal and Professional Responsibilities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-100">
      <body
        className={
          nunito.className +
          " bg-gradient-to-b from-yellow-200 to-white-200 bg-no-repeat bg-cover"
        }
      >
        {children}
        <Modal />
      </body>
    </html>
  );
}
