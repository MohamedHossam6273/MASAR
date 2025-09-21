
export type StoryChoice = {
  choice_text_ar: string;
  next_node_id: string;
};

export type StoryNode = {
  node_id: string;
  text_ar: string;
  image_url: string; // Filename of the image for this node
  choices?: StoryChoice[];
};

export type Story = {
  id: string; // The story's folder name, added at fetch time
  title: string; // Added from the story list
  story_id: string;
  languages: string[];
  nodes: StoryNode[];
};

export type StoryListItem = {
    id: string; // Corresponds to the folder name
    title: string;
    subtitle: string;
    cover_image_url: string; // Full URL to the cover image
    difficulty: 'easy' | 'medium' | 'hard';
    learning_concepts: string;
};
