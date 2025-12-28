import Image from "next/image";

import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { featuredCategories } from "@/data/mockData";

export function CategoryHighlights() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[color:var(--foreground)] md:text-3xl">
            Discover curated categories
          </h2>
          <p className="text-sm text-[color:var(--muted)]">
            Optimised for Nigeria, Ghana, Kenya and the rest of Africa.
          </p>
        </div>
        <Button variant="secondary" href="/categories">
          Browse all categories
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {featuredCategories.map((category) => (
          <Card key={category.slug} className="overflow-hidden">
            <div className="grid gap-6 p-6 md:grid-cols-[0.8fr,1fr] md:p-8">
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">
                  {category.name}
                </span>
                <p className="text-lg font-semibold text-[color:var(--foreground)]">
                  {category.description}
                </p>
                <Button variant="accent" href={`/category/${category.slug}`}>
                  Shop {category.name}
                </Button>
              </div>
              <div className="relative h-56 overflow-hidden rounded-2xl">
                <Image
                  src={category.heroImage}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[color:var(--primary)]/20 to-transparent" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
