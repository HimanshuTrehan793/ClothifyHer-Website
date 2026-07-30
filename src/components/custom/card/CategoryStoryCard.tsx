import { Link } from "react-router";
import type { CategoryStory } from "@/interfaces/catalog";

/** Instagram-story style circular chip with a gold ring. */
export function CategoryStoryCard({ story }: { story: CategoryStory }) {
  return (
    <Link
      to={story.href}
      className="group flex w-[76px] shrink-0 flex-col items-center gap-2 sm:w-[92px]"
    >
      <span className="from-gold-400 via-maroon-600 to-gold-400 rounded-full bg-gradient-to-tr p-[2px] transition-transform duration-300 group-hover:scale-105">
        <span className="block rounded-full bg-stone-50 p-[3px]">
          <img
            src={story.image}
            alt=""
            loading="lazy"
            className="h-[62px] w-[62px] rounded-full object-cover sm:h-[76px] sm:w-[76px]"
          />
        </span>
      </span>
      <span className="group-hover:text-maroon-800 text-center text-[13px] font-medium text-stone-700 transition-colors">
        {story.label}
      </span>
    </Link>
  );
}
