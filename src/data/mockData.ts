import { type Product } from "@/types/product";

export const featuredCategories = [
  {
    name: "Electronics",
    slug: "electronics",
    heroImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    description: "Smartphones, laptops, accessories, and the latest gadgets",
  },
  {
    name: "Fashion",
    slug: "fashion",
    heroImage:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    description: "African inspired wear, sneakers, bags, and more",
  },
  {
    name: "Beauty",
    slug: "beauty",
    heroImage:
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    description: "Skin care, hair products, grooming essentials",
  },
  {
    name: "Home & Living",
    slug: "home-living",
    heroImage:
      "https://images.unsplash.com/photo-1484100356142-db6ab6244067?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    description: "Home decor, kitchen tools, bedding, and appliances",
  },
];

export const heroHighlights = [
  {
    label: "Fast Fulfilment",
    description: "Automated CJdropshipping sourcing straight to your customers",
  },
  {
    label: "Secured Payments",
    description: "Paystack powered payouts with instant seller onboarding",
  },
  {
    label: "Trusted Sellers",
    description: "Manual verification keeps the marketplace safe and premium",
  },
];

export const mockProducts: Product[] = [
  {
    id: "1",
    title: "Anker Soundcore Liberty 4",
    description: "Active noise cancelling earbuds with LDAC support and 36h battery life",
    price: 78000,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1580894749908-2c88bce64a70?auto=format&fit=crop&w=1200&q=80",
    rating: 4.7,
    seller: {
      name: "Tech Hub Africa",
      location: "Lagos, Nigeria",
    },
    stock: 45,
  },
  {
    id: "2",
    title: "Minimalist Accent Chair",
    description: "Breathable premium fabric with solid wooden legs",
    price: 125000,
    category: "home-living",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    rating: 4.4,
    seller: {
      name: "Nordic Loft",
      location: "Abuja, Nigeria",
    },
    stock: 12,
  },
  {
    id: "3",
    title: "Glow Ritual Skincare Set",
    description: "Five-step hydrating routine tailored for melanin rich skin",
    price: 42000,
    category: "beauty",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    rating: 4.9,
    seller: {
      name: "Ethereal Beauty",
      location: "Accra, Ghana",
    },
    stock: 28,
  },
  {
    id: "4",
    title: "Flutter Sleeve Ankara Dress",
    description: "Handmade Ankara dress with modern silhouette and pockets",
    price: 31500,
    category: "fashion",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    rating: 4.8,
    seller: {
      name: "Ethnic Vogue",
      location: "Lagos, Nigeria",
    },
    stock: 63,
  },
];
