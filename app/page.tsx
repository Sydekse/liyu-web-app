import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { Navbar } from "@/components/layout/navbar";
import { Testimonials } from "@/components/reviews/testimonials";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <Testimonials />
      <div className="text-center bg-[#532516] text-white rounded-lg p-12">
        <h2 className="text-3xl font-bold mb-4">
          Let&apos;s Create Something Special
        </h2>
        <p className="mb-8 max-w-2xl mx-auto">
          From intimate family gatherings to grand celebrations, we bring the
          authentic flavors and warm hospitality of Ethiopian cuisine to your
          special events.
        </p>
        <Button asChild className="bg-[#E8982E] hover:bg-[#E8982E]/90">
          <Link href="/book">Plan Your Event</Link>
        </Button>
      </div>
    </main>
  );
}
