import Link from "next/link";

import { Card } from "@/components/shared/Card";
import { featuredCategories } from "@/data/mockData";

export default function CategoriesPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-[color:var(--foreground)]">Shop by category</h1>
        <p className="text-sm text-[color:var(--muted)]">
          Browse featured categories handpicked for African shoppers.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {featuredCategories.map((category) => (
          <Card key={category.slug} className="overflow-hidden">
            <div className="bg-[color:var(--surface)] p-6">
              <h2 className="text-xl font-semibold text-[color:var(--foreground)]">{category.name}</h2>
              <p className="mt-2 text-sm text-[color:var(--muted)]">{category.description}</p>
              <Link
                href={`/category/${category.slug}`}
                className="mt-4 inline-flex items-center text-sm font-semibold text-[color:var(--primary)]"
              >
                Explore {category.name} →
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
