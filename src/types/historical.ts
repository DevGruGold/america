
export interface Character {
  id?: string;
  name: string;
  role: string;
  nationality?: string;
  era?: string;
  imageUrl: string;
  description: string;
  voiceId: string;
  prompt: string;
}

export interface CharacterCardProps {
  character: Character;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  generatedText: string;
  onPlay: (index: number) => void;
  onPause: () => void;
  onReset: () => void;
}

export interface ChatProps {
  voiceId: string;
}
