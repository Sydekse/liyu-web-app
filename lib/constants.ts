export const NAVIGATION_ITEMS = [
  { name: "Home", href: "/" },
  { name: "Packages", href: "/packages" },
  { name: "Events", href: "/events" },
  { name: "About", href: "/about" },
  { name: "Book Now", href: "/book" },
];
import EventOne from "@/public/assets/images/h1.png";
import EventTwo from "@/public/assets/images/h5.jpeg";
import EventThree from "@/public/assets/images/event 3.png";
import Eventpartiy from "@/public/assets/images/event 4.png";
import Eventfive from "@/public/assets/images/carity.jpg";

export const PACKAGES = [
  {
    name: "Essential",
    price: 25,
    description: "Perfect for intimate gatherings",
    features: [
      "Up to 50 guests",
      "Basic menu selection",
      "Standard setup",
      "4-hour service",
    ],
  },
  {
    name: "Premium",
    price: 45,
    description: "Ideal for medium-sized events",
    features: [
      "Up to 100 guests",
      "Extended menu selection",
      "Premium setup",
      "6-hour service",
      "Dedicated event coordinator",
    ],
    featured: true,
  },
  {
    name: "Luxury",
    price: 75,
    description: "For grand celebrations",
    features: [
      "200 +",
      "Full menu customization",
      "Luxury setup",
      "8-hour service",
      "Dedicated team",
    ],
  },
];
export const EVENT_TYPES = [
  {
    title: "Weddings",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3",
    description:
      "Make your special day unforgettable with our elegant wedding catering services.",
  },
  {
    title: "Corporate Events",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3",
    description:
      "Impress your clients and colleagues with professional corporate catering solutions.",
  },
  {
    title: "Private Parties",
    image:Eventpartiy,
    description:
      "Celebrate life's moments with customized private party catering services.",
  },
  {
    title: "Social Gatherings",
    image: EventTwo,
    description:
      "Create lasting memories with friends and family through our social event catering.",
  },
];

export const PREVIOUS_EVENTS = [
  {
    title: "Children Birthday",
    date: "March 2024",
    image: EventThree,
    description: "Catered for 50+ kids and family with a tradtitional menu.",
    testimonial:
      "The food was exceptional and the service impeccable. Highly recommended!",
    client: "Kid's Mom",
  },
  {
    title: "Reunion Party",
    date: "February 2024",
    image: EventOne,
    description: "An intimate garden wedding with custom farm-to-table menu.",
    testimonial: "Liyu Catering made our special day even more magical.",
    client: "Meseret & Dawit",
  },
  {
    title: "Baby Shower",
    date: "January 2025",
    image: Eventfive,
    description: "Elegant five-course dinner service for a baby shower for 30 guests.",
    testimonial: "Professional service that exceeded our expectations.",
    client: "Beza Ayalew",
  },
];
