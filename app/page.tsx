import Header from "@/components/Header";
import Board from "@/components/Board";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-between">
      <Header />
      <Board />
      <Footer />
    </main>
  );
}
