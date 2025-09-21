import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

type Recommendation = {
  id: string;
  title: string;
  description?: string;
  learningConcepts: string;
  difficulty: string;
  coverImageUrl?: string;
}

type RecommendationListProps = {
  recommendations: Recommendation[];
}

export function RecommendationList({ recommendations }: RecommendationListProps) {
  const difficultyColors: { [key: string]: string } = {
    easy: 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400',
    medium: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    hard: 'border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400',
  };

  const difficultyTranslations: { [key: string]: string } = {
    easy: 'سهل',
    medium: 'متوسط',
    hard: 'صعب',
  };

  const aspectRatios = ['aspect-[4/3]', 'aspect-[3/4]', 'aspect-[1/1]'];

  // Simple deterministic function to get an index based on the story id
  const getDeterministicIndex = (id: string, max: number) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash) % max;
  };

  return (
    <div className="[column-fill:_balance] sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
      {recommendations.map((rec) => {
        const aspectRatio = aspectRatios[getDeterministicIndex(rec.id, aspectRatios.length)];
        
        return (
          <div key={rec.id} className="break-inside-avoid group">
            <Card className="flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
              <Link href={`/story/${rec.id}`} className="block relative">
                {rec.coverImageUrl && (
                  <div className={cn("relative w-full", aspectRatio)}>
                    <Image
                      src={rec.coverImageUrl}
                      alt={`Cover image for ${rec.title}`}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button variant="secondary">
                         ابدأ القراءة <ArrowLeft className="mr-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Link>
              <CardContent className="p-4 space-y-3">
                <h3 className="text-lg font-bold leading-tight">{rec.title}</h3>
                {rec.description && <p className="text-sm text-muted-foreground">{rec.description}</p>}
                <div className="space-y-3 pt-2">
                  <div>
                    <h4 className="font-semibold mb-2 text-xs text-muted-foreground">مفاهيم التعلم</h4>
                    <div className="flex flex-wrap gap-2">
                      {rec.learningConcepts.split(',').map((concept: string) => (
                        <Badge key={concept.trim()} variant="secondary" className="text-xs">{concept.trim()}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-xs text-muted-foreground">الصعوبة</h4>
                    <Badge variant="outline" className={`${difficultyColors[rec.difficulty]} text-xs`}>
                      {difficultyTranslations[rec.difficulty] || rec.difficulty}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      })}
    </div>
  );
}
