import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Story } from "@/components/sections/Story";
import { Reviews } from "@/components/sections/Reviews";
import FAQ from '@/components/sections/FAQ';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Story />
        <Reviews />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
