import { Nunito } from "@next/font/google";
import "./globals.css";
import Modal from "@/components/Modal/AddTaskModal/AddTaskModal";

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
    <html lang="en">
      <body
        className={`${nunito.className} min-h-screen bg-gradient-to-t from-yellow-100 via-yellow-300 to-yellow-600 bg-no-repeat`}
      >
        {children}
        <Modal />
      </body>
    </html>
  );
}
