import Image from "next/image";

import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { featuredCategories } from "@/data/mockData";

export function CategoryHighlights() {
  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-[color:var(--foreground)] md:text-3xl">
            Discover curated categories
          </h2>
          <p className="text-base text-[color:var(--muted)]">
            Optimised for Nigeria, Ghana, Kenya and the rest of Africa.
          </p>
        </div>
        <Button variant="outline" href="/categories">
          Browse all categories
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {featuredCategories.map((category) => (
          <Card key={category.slug} className="overflow-hidden group border-[color:var(--border)] hover:border-[color:var(--primary)]/30 transition-colors">
            <div className="grid gap-6 p-6 md:grid-cols-[0.8fr,1fr] md:p-8 h-full">
              <div className="flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[color:var(--primary)]">
                    {category.name}
                  </span>
                  <p className="mt-2 text-xl font-bold text-[color:var(--foreground)] leading-snug">
                    {category.description}
                  </p>
                </div>
                <Button variant="accent" size="sm" href={`/category/${category.slug}`} className="w-fit">
                  Shop {category.name}
                </Button>
              </div>
              <div className="relative h-48 md:h-auto overflow-hidden rounded-2xl">
                <Image
                  src={category.heroImage}
                  alt={category.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[color:var(--primary)]/10 to-transparent" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
