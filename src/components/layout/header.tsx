'use client';

import Link from "next/link";
import { BookOpenText, Flame, Star } from "lucide-react";
import { Button } from "../ui/button";
import { ModeToggle } from "../mode-toggle";
import { useUserProgress } from "@/hooks/use-user-progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function Header() {
  const { userProgress } = useUserProgress();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="ml-6 flex items-center space-x-2">
          <BookOpenText className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg font-headline sm:inline-block">
            مسار
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
             <TooltipProvider>
                <div className="flex items-center gap-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center gap-1 text-sm font-semibold text-yellow-500">
                                <Star className="h-5 w-5" />
                                {userProgress.xp}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                        <p>نقاط الخبرة</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center gap-1 text-sm font-semibold text-orange-500">
                                <Flame className="h-5 w-5" />
                                {userProgress.currentStreak}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                        <p>سلسلة التعلم</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
            <Button variant="ghost" asChild>
                <Link href="/recommendations">القصص</Link>
            </Button>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
