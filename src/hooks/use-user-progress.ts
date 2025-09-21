'use client';

import { useState, useEffect, useCallback } from 'react';
import { isSameDay, subDays } from 'date-fns';

const PROGRESS_KEY = 'choicelearn-user-progress';

type StoryProgress = {
  [storyId: string]: {
    progress: number;
    completed: boolean;
  };
};

type UserProgress = {
  xp: number;
  unlockedBadges: string[];
  lastLogin: string; // ISO date string
  currentStreak: number;
  storyProgress: StoryProgress;
  unlockedStories: string[];
};

const defaultProgress: UserProgress = {
  xp: 0,
  unlockedBadges: [],
  lastLogin: new Date().toISOString(),
  currentStreak: 1,
  storyProgress: {},
  unlockedStories: ['lean_startup_quest'], // Start with one unlocked story
};

export function useUserProgress() {
  const [userProgress, setUserProgress] = useState<UserProgress>(defaultProgress);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedProgress = localStorage.getItem(PROGRESS_KEY);
      if (storedProgress) {
        setUserProgress(JSON.parse(storedProgress));
      } else {
        // Initialize for first-time users
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(defaultProgress));
      }
    } catch (error) {
      console.error("Failed to load user progress from localStorage:", error);
    } finally {
        setIsLoaded(true);
    }
  }, []);

  const saveProgress = useCallback((newProgress: UserProgress) => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(newProgress));
      setUserProgress(newProgress);
    } catch (error) {
      console.error("Failed to save user progress to localStorage:", error);
    }
  }, []);

  const addXp = useCallback((points: number) => {
    if (!isLoaded) return;
    const newProgress = { ...userProgress, xp: userProgress.xp + points };
    saveProgress(newProgress);
  }, [userProgress, isLoaded, saveProgress]);

  const unlockBadge = useCallback((badgeId: string) => {
    if (!isLoaded || userProgress.unlockedBadges.includes(badgeId)) return;
    const newProgress = {
      ...userProgress,
      unlockedBadges: [...userProgress.unlockedBadges, badgeId],
    };
    saveProgress(newProgress);
  }, [userProgress, isLoaded, saveProgress]);
  
  const checkAndUpdateStreak = useCallback(() => {
    if (!isLoaded) return;
    const today = new Date();
    const lastLoginDate = new Date(userProgress.lastLogin);

    if (isSameDay(today, lastLoginDate)) {
        return; // Already logged in today
    }
    
    const yesterday = subDays(today, 1);
    
    let newStreak = userProgress.currentStreak;
    if (isSameDay(yesterday, lastLoginDate)) {
        newStreak += 1; // It's a consecutive day
    } else {
        newStreak = 1; // Streak is broken
    }

    const newProgress = {
        ...userProgress,
        lastLogin: today.toISOString(),
        currentStreak: newStreak,
    };
    saveProgress(newProgress);

  }, [isLoaded, userProgress, saveProgress]);

  const updateStoryProgress = useCallback((storyId: string, progress: number) => {
    if (!isLoaded) return;
    const newStoryProgress = {
        ...userProgress.storyProgress,
        [storyId]: {
            ...userProgress.storyProgress[storyId],
            progress,
        }
    };
    const newProgress = { ...userProgress, storyProgress: newStoryProgress };
    saveProgress(newProgress);
  }, [userProgress, isLoaded, saveProgress]);

  const completeStory = useCallback((storyId: string) => {
    if (!isLoaded) return;
     const newStoryProgress = {
        ...userProgress.storyProgress,
        [storyId]: {
            progress: 100,
            completed: true,
        }
    };
    const newProgress = { ...userProgress, storyProgress: newStoryProgress };
    saveProgress(newProgress);
  }, [userProgress, isLoaded, saveProgress]);
  
  const unlockStory = useCallback((storyId: string) => {
      if (!isLoaded || userProgress.unlockedStories.includes(storyId)) return;
      const newProgress = {
          ...userProgress,
          unlockedStories: [...userProgress.unlockedStories, storyId]
      };
      saveProgress(newProgress);
  }, [userProgress, isLoaded, saveProgress]);


  return { userProgress, addXp, unlockBadge, checkAndUpdateStreak, updateStoryProgress, completeStory, unlockStory, isLoaded };
}
