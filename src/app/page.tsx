import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { RotatingText } from '@/components/rotating-text';

export default function Home() {
  const rotatingTaglines = [
    "كل قصة هي خطوة نحو نسخة أفضل منك. اقرأ لتعيش، وتعلم لتكتمل.",
    "ماذا لو كانت أهم مهارة يمكن أن تتعلمها مخبأة داخل قصة لم تُروَ بعد؟ اقرأ، عش، وتعلم.",
    "انسَ طريقة التعلم القديمة. هنا، تبدأ رحلة المعرفة حيث تنتهي الحكاية، وكل قرار هو درس جديد.",
  ];

  return (
    <section className="relative h-[calc(100vh-65px)] flex items-center justify-center">
      <Image
        src="https://picsum.photos/seed/choicelearn-hero/1920/1080"
        alt="A library of books"
        data-ai-hint="library books"
        fill
        className="object-cover -z-20"
        priority
      />
      <div className="absolute inset-0 bg-background/80 dark:bg-background/90 -z-10" />
      <div className="container mx-auto px-4 text-center">
        <div
          className="animate-fade-in-up"
          style={{ animationFillMode: 'backwards' }}
        >
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 text-primary">
            مسار
          </h1>
          <div className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto text-foreground/80 h-24 flex items-center justify-center">
            <RotatingText texts={rotatingTaglines} />
          </div>
        </div>
        <div
          className="animate-fade-in-up"
          style={{ animationFillMode: 'backwards', animationDelay: '200ms' }}
        >
          <Button asChild size="lg">
            <Link href="/recommendations">
              تعالى نقرا حكاية... ونكتسب مهارة
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
