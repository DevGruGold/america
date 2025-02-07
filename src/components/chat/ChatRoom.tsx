import { useState, useEffect } from "react";
import { Character } from "@/types/historical";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChatMessage } from "./ChatMessage";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const topics = [
  "The Role of Arts in Democracy",
  "National Unity and Cultural Heritage",
  "Education and Social Progress",
  "Leadership in Times of Change",
  "Justice and Equality"
];

interface Message {
  character: Character;
  content: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export const ChatRoom = ({ characters }: { characters: Character[] }) => {
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  const handleCharacterSelect = (character: Character) => {
    if (selectedCharacters.includes(character)) {
      setSelectedCharacters(prev => prev.filter(c => c !== character));
    } else if (selectedCharacters.length < 3) {
      setSelectedCharacters(prev => [...prev, character]);
    } else {
      toast({
        title: "Maximum characters reached",
        description: "You can select up to 3 characters for the discussion.",
        variant: "destructive",
      });
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const generateDiscussion = async () => {
    if (selectedCharacters.length < 2) {
      toast({
        title: "Not enough characters",
        description: "Please select at least 2 characters for the discussion.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedTopic) {
      toast({
        title: "No topic selected",
        description: "Please select a topic for the discussion.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setRetryCount(0);

    const attemptGeneration = async (attempt: number): Promise<void> => {
      try {
        const initialPrompt = `You are moderating a discussion between ${selectedCharacters.map(c => c.name).join(", ")} about ${selectedTopic}. 
          Each character should speak in their own voice and perspective, drawing from their historical context and experiences.
          Generate a natural conversation between these figures, with each taking turns to speak.`;

        const { data, error } = await supabase.functions.invoke('generate-with-gemini', {
          body: { prompt: initialPrompt }
        });

        if (error) {
          if (error.message.includes("503") && attempt < MAX_RETRIES) {
            toast({
              title: "API Temporarily Unavailable",
              description: `Retrying in ${RETRY_DELAY/1000} seconds... (Attempt ${attempt + 1}/${MAX_RETRIES})`,
              variant: "default",
            });
            await delay(RETRY_DELAY);
            return attemptGeneration(attempt + 1);
          }
          throw error;
        }

        if (data?.generatedText) {
          const lines = data.generatedText.split('\n').filter(line => line.trim());
          const newMessages: Message[] = [];

          for (let i = 0; i < lines.length; i++) {
            const character = selectedCharacters[i % selectedCharacters.length];
            newMessages.push({
              character,
              content: lines[i]
            });
          }

          setMessages(newMessages);
          toast({
            title: "Discussion Generated",
            description: "The historical figures have started their conversation.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Error generating discussion:", error);
        toast({
          title: "Error",
          description: error.message.includes("503") 
            ? "The AI service is currently overloaded. Please try again in a few minutes."
            : "Failed to generate discussion. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsGenerating(false);
      }
    };

    attemptGeneration(0);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary mb-4">Historical Discussion Room</h2>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Select Characters (2-3)</h3>
          <div className="flex flex-wrap gap-2">
            {characters.map((character) => (
              <Button
                key={character.name}
                variant={selectedCharacters.includes(character) ? "default" : "outline"}
                onClick={() => handleCharacterSelect(character)}
                className="flex items-center gap-2"
              >
                <img 
                  src={character.imageUrl} 
                  alt={character.name} 
                  className="w-6 h-6 rounded-full object-cover"
                />
                {character.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Select Topic</h3>
          <Select onValueChange={setSelectedTopic}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a topic for discussion" />
            </SelectTrigger>
            <SelectContent>
              {topics.map((topic) => (
                <SelectItem key={topic} value={topic}>
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={generateDiscussion} 
          disabled={isGenerating || selectedCharacters.length < 2 || !selectedTopic}
          className="w-full"
        >
          {isGenerating ? "Generating Discussion..." : "Start Discussion"}
        </Button>
      </div>

      <ScrollArea className="h-[400px] border rounded-lg p-4">
        {messages.map((message, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <img 
                src={message.character.imageUrl} 
                alt={message.character.name} 
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-semibold">{message.character.name}</span>
            </div>
            <div className="pl-10">
              <p className="text-gray-700">{message.content}</p>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            Select characters and a topic to start a historical discussion
          </div>
        )}
      </ScrollArea>
    </div>
  );
};