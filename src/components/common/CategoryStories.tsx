import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { CategoryStoryCard } from "@/components/custom/card/CategoryStoryCard";
import type { CategoryStory } from "@/interfaces/catalog";

interface CategoryStoriesProps {
  stories: CategoryStory[];
  /** "Explore All" link rendered above the rail — the categories index page. */
  action?: { label: string; href: string };
}

export function CategoryStories({ stories, action }: CategoryStoriesProps) {
  return (
    <section
      aria-label="Shop by category"
      className="border-maroon-100 bg-cream-100/60 border-b"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {action && (
          <div className="flex items-center justify-between gap-4 pt-3">
            <span className="text-xs font-semibold tracking-wide text-stone-500 uppercase">
              Shop by Category
            </span>
            <Link
              to={action.href}
              className="text-maroon-700 hover:text-maroon-900 group inline-flex shrink-0 items-center gap-1 text-sm font-medium transition-colors"
            >
              {action.label}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}

        <div className="hide-scrollbar flex gap-4 overflow-x-auto py-4 sm:gap-6 lg:justify-center">
          {stories.map((story) => (
            <CategoryStoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
}
