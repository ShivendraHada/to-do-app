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
    <html lang="en" className="h-full">
      <body
        className={
          nunito.className +
          " bg-gradient-to-b from-yellow-300 to-white-100 bg-no-repeat bg-cover"
        }
      >
        {children}
        <Modal />
      </body>
    </html>
  );
}
