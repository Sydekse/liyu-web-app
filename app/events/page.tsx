import { Navbar } from '@/components/layout/navbar';
import { EVENT_TYPES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { PreviousEvents } from '@/components/events/previous-events';
import { Testimonials } from '@/components/reviews/testimonials';
import Link from 'next/link';
import Image from 'next/image';

export default function EventsPage() {
  return (
    <div>
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-[#532516] mb-4">
              Catering for Every Occasion
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From intimate gatherings to grand celebrations, we provide exceptional
              catering services tailored to your specific event needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {EVENT_TYPES.map((event) => (
              <div
                key={event.title}
                className="group relative overflow-hidden rounded-lg"
              >
                <Image
                  src={event.image}
                  alt={event.title}
                  width={600}
                  height={400}
                  className="aspect-w-16 aspect-h-9 w-full object-cover"
                  style={{
                    height: '300px',
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-200 mb-4">{event.description}</p>
                  <Button
                    asChild
                    className="w-full sm:w-auto bg-[#E8982E] hover:bg-[#532516]"
                  >
                    <Link href="/book">Book This Event</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <PreviousEvents />
      <Testimonials />
    </div>
  );
}