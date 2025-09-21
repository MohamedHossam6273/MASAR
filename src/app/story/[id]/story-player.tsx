'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import type { Story, StoryChoice } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { event } from '@/lib/gtag';
import { useUserProgress } from '@/hooks/use-user-progress';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Flame, Star } from 'lucide-react';

export function StoryPlayer({ story }: { story: Story }) {
  const { 
    userProgress, 
    addXp, 
    updateStoryProgress,
    completeStory,
    checkAndUpdateStreak 
  } = useUserProgress();
  
  const { toast } = useToast();
  const [currentNodeId, setCurrentNodeId] = useState(story.nodes[0].node_id);
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    checkAndUpdateStreak();
    event({
      action: 'story_started',
      params: {
        story_id: story.id,
        story_title: story.title,
      },
    });
    setStartTime(Date.now());

    const handleBeforeUnload = () => {
      const currentNode = story.nodes.find((node) => node.node_id === currentNodeId);
      const isEndingNode = !currentNode?.choices || currentNode.choices.length === 0;

      if (currentNode && !isEndingNode) {
        event({
            action: 'story_dropoff',
            params: {
                story_id: story.id,
                story_title: story.title,
                last_node_id: currentNode.node_id,
                last_node_index: story.nodes.findIndex(n => n.node_id === currentNode.node_id),
            }
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story.id, story.title]);
  
  const currentNode = story.nodes.find((node) => node.node_id === currentNodeId);
  const currentNodeIndex = story.nodes.findIndex((node) => node.node_id === currentNodeId);
  const isEndingNode = !currentNode?.choices || currentNode.choices.length === 0;

  const storyProgress = useMemo(() => {
    if (story.nodes.length <= 1) return 100;
    if (isEndingNode) return 100;
    const progress = (currentNodeIndex / (story.nodes.length - 1)) * 100;
    return Math.min(progress, 100);
  }, [currentNodeIndex, story.nodes.length, isEndingNode]);
  
  const handleStoryCompletion = useCallback(() => {
     if (startTime > 0) {
        const duration = Math.round((Date.now() - startTime) / 1000);
        event({
            action: 'story_completed',
            params: {
                story_id: story.id,
                story_title: story.title,
                duration: duration,
                total_nodes: story.nodes.length,
            }
        });
        setStartTime(0); // Prevent re-firing
        
        completeStory(story.id);
        const completionXp = 100;
        addXp(completionXp);
        toast({
            title: "قصة مكتملة!",
            description: (
                <div className="flex items-center">
                    <Flame className="ml-2 h-4 w-4 text-orange-500" />
                    +{completionXp} نقاط خبرة
                </div>
            ),
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, story.id, story.title, story.nodes.length, completeStory, addXp, toast]);
  
  useEffect(() => {
    updateStoryProgress(story.id, storyProgress);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story.id, storyProgress]);

  useEffect(() => {
    if (isEndingNode || currentNodeId === 'end') {
        handleStoryCompletion();
    }
  }, [currentNodeId, isEndingNode, handleStoryCompletion]);

  const imageUrl = currentNode?.image_url ? `/stories/${story.id}/${currentNode.image_url}`.replace('.png', '').replace('.jpg', '') : "https://picsum.photos/seed/story-placeholder/1920/1080";
  const imageHint = currentNode?.text_ar.substring(0, 30) || "story image";

  if (!currentNode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-65px)] text-center p-4">
        <h1 className="text-3xl font-bold font-headline mb-4">خطأ في القصة</h1>
        <p className="text-muted-foreground mb-8">لم يتم العثور على هذا الجزء من القصة.</p>
        <Button asChild>
          <Link href="/recommendations">العودة إلى كل القصص</Link>
        </Button>
      </div>
    );
  }

  const handleChoice = (choice: StoryChoice) => {
    event({
        action: 'choice_made',
        params: {
            story_id: story.id,
            node_id: currentNodeId,
            choice_text: choice.choice_text_ar,
            next_node_id: choice.next_node_id,
        }
    });

    addXp(10); // Award 10 XP for making a choice
    toast({
        title: "أحسنت!",
        description: (
            <div className="flex items-center">
                <Star className="ml-2 h-4 w-4 text-yellow-400" />
                +10 نقاط خبرة
            </div>
        ),
    });

    if (!choice.next_node_id) {
        setCurrentNodeId('end');
    } else {
        setCurrentNodeId(choice.next_node_id);
    }
  };
  
  const handleAffiliateClick = (url: string) => {
    event({
        action: 'affiliate_click',
        params: {
            story_id: story.id,
            story_title: story.title,
            affiliate_url: url,
        }
    });
    window.open(url, '_blank');
  };

  if (currentNodeId === 'end' || isEndingNode) {
     return (
      <div className="relative min-h-[calc(100vh-65px)] flex items-center justify-center p-4">
        <Image
            src={`https://picsum.photos/seed/${story.id}-${currentNode.node_id}/1920/1080`}
            alt={imageHint}
            data-ai-hint={imageHint}
            fill
            className="object-cover -z-20 transition-opacity duration-1000"
            key={currentNode.node_id}
        />
        <div className="absolute inset-0 bg-black/70 -z-10" />

        <div className="max-w-prose w-full text-lg text-foreground bg-black/40 backdrop-blur-md p-8 rounded-lg shadow-2xl border border-white/10">
            <div className="w-full animate-fade-in">
                <p className="mb-4 leading-relaxed text-white">{currentNode.text_ar}</p>
                {/* Example Affiliate Link */}
                <p className="text-center text-sm text-gray-300 my-4">أعجبك ما تعلمته؟ تحقق من الكتاب الكامل:</p>
                <Button onClick={() => handleAffiliateClick(`https://www.amazon.com/dp/B004J4XGN6?tag=youraffiliatetag-20`)} className='w-full'>
                    شراء "The Lean Startup" على أمازون
                </Button>
            </div>
            <div className='flex flex-col gap-4 mt-8'>
                <h2 className="text-xl font-bold text-center text-white">النهاية</h2>
                <Button asChild>
                    <Link href="/recommendations">ابحث عن قصة جديدة</Link>
                </Button>
                <Button variant="outline" onClick={() => setCurrentNodeId(story.nodes[0].node_id)}>
                    ابدأ هذه القصة من جديد
                </Button>
            </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative min-h-[calc(100vh-65px)] flex items-center justify-center p-4">
      <Image
        src={`https://picsum.photos/seed/${story.id}-${currentNode.node_id}/1920/1080`}
        alt={imageHint}
        data-ai-hint={imageHint}
        fill
        className="object-cover -z-20 transition-opacity duration-1000"
        key={currentNode.node_id}
      />
      <div className="absolute inset-0 bg-black/70 -z-10" />

      <div className="max-w-prose w-full text-lg text-foreground bg-black/40 backdrop-blur-md p-8 rounded-lg shadow-2xl border border-white/10">
        <div className="w-full animate-fade-in">
            <Progress value={storyProgress} className="mb-4 h-2" />
            <p className="mb-6 leading-relaxed text-white">{currentNode.text_ar}</p>
            <div className='flex flex-col gap-2'>
            {currentNode.choices?.map((choice, index) => (
                <Button
                    key={index}
                    onClick={() => handleChoice(choice)}
                    variant="outline"
                    className="bg-background/20 hover:bg-accent hover:text-accent-foreground justify-start text-right w-full text-white hover:text-accent-foreground"
                >
                    {choice.choice_text_ar}
                </Button>
            ))}
            </div>
        </div>
      </div>
    </div>
  );
}
