
import { RecommendationList } from "@/components/recommendation-list";
import { getStories } from '@/lib/stories';
import type { StoryListItem } from "@/lib/types";

export const metadata = {
    title: "كل القصص | مسار",
    description: "تصفح جميع القصص المتاحة.",
};

export default async function RecommendationsPage() {
  const stories = await getStories();

  const recommendations = stories.map((story: StoryListItem) => ({
    id: story.id,
    title: story.title,
    description: story.subtitle,
    learningConcepts: story.learning_concepts,
    difficulty: story.difficulty,
    coverImageUrl: story.cover_image_url
  }));

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-3 text-primary">
          مكتبة القصص
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          تصفح مكتبتنا من القصص التفاعلية. كل قصة مصممة لتعليمك مهارة جديدة بطريقة ممتعة.
        </p>
      </div>
      
      <RecommendationList recommendations={recommendations} />
    </div>
  );
}
