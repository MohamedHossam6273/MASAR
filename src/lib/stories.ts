import type { Story, StoryListItem } from './types';
import AllStories from './stories-data/story-list.json';
import TheLeanStartupQuest from './stories-data/lean_startup_quest/story.json';

const storyDataMap: { [key: string]: any } = {
  lean_startup_quest: TheLeanStartupQuest,
};

/**
 * Fetches the list of all available stories from the imported JSON file.
 */
export const getStories = async (): Promise<StoryListItem[]> => {
  return AllStories.stories;
};

/**
 * Fetches the content of a single story by its ID.
 * @param id - The ID of the story to fetch.
 */
export const getStoryById = async (id: string): Promise<Story | null> => {
  const storyInfo = AllStories.stories.find(story => story.id === id);

  if (!storyInfo) {
    console.error(`Story info not found for id (${id}) in story-list.json`);
    return null;
  }

  const storyContent = storyDataMap[id];

  if (!storyContent) {
    console.error(`Story content for id (${id}) not found. Make sure it's imported in src/lib/stories.ts`);
    return null;
  }

  // Combine metadata and content
  return { 
    ...storyContent, 
    id: storyInfo.id, 
    title: storyInfo.title 
  };
};
