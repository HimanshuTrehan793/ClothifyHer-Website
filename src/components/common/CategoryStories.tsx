import { CategoryStoryCard } from "@/components/custom/card/CategoryStoryCard";
import type { CategoryStory } from "@/interfaces/catalog";

export function CategoryStories({ stories }: { stories: CategoryStory[] }) {
  return (
    <section
      aria-label="Shop by category"
      className="border-maroon-100 bg-cream-100/60 border-b"
    >
      <div className="hide-scrollbar mx-auto flex max-w-7xl gap-4 overflow-x-auto px-4 py-4 sm:gap-6 sm:px-6 lg:justify-center lg:px-10">
        {stories.map((story) => (
          <CategoryStoryCard key={story.id} story={story} />
        ))}
      </div>
    </section>
  );
}
