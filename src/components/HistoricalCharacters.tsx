
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Character } from "@/types/historical";
import { Tabs } from "@/components/ui/tabs";
import { CharacterTabs } from "./characters/CharacterTabs";
import { CharacterContent } from "./characters/CharacterContent";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

async function fetchHistoricalFigures(): Promise<Character[]> {
  const { data, error } = await supabase
    .from('historical_figures')
    .select('*')
    .order('name');
    
  if (error) {
    throw new Error('Failed to fetch historical figures');
  }

  return data.map(figure => ({
    ...figure,
    imageUrl: figure.image_url,
  }));
}

export const HistoricalCharacters = () => {
  const { toast } = useToast();
  const [activeCharacter, setActiveCharacter] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatedText, setGeneratedText] = useState("");

  const { data: characters = [], isLoading, error } = useQuery({
    queryKey: ['historical-figures'],
    queryFn: fetchHistoricalFigures,
  });

  useEffect(() => {
    if (characters.length > 0 && !activeCharacter) {
      setActiveCharacter(characters[0].name.toLowerCase().replace(/\s+/g, ''));
    }
  }, [characters, activeCharacter]);

  useEffect(() => {
    if (!isLoading && !error) {
      toast({
        title: "AI Models Ready",
        description: "The historical figure simulations are ready for interaction.",
        variant: "default",
      });
    }

    if (error) {
      toast({
        title: "Error Loading Characters",
        description: "Failed to load historical figures. Please try again later.",
        variant: "destructive",
      });
    }
  }, [isLoading, error, toast]);

  const handlePlaybackComplete = () => {
    setIsPlaying(false);
    setGeneratedText("");
  };

  if (isLoading) {
    return (
      <div className="py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p>Loading historical figures...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center text-red-600">
          <p>Failed to load historical figures. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-primary text-center mb-6">
          Meet Historical Figures
        </h2>
        <div className="text-center mb-12">
          <p className="text-lg text-gray-600 mb-3 max-w-2xl mx-auto">
            Experience AI-powered simulations of historical figures discussing their lives, achievements, and perspectives.
          </p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Powered by advanced AI technology and realistic avatar generation
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <Tabs 
            defaultValue={characters[0]?.name.toLowerCase().replace(/\s+/g, '')} 
            className="w-full" 
            onValueChange={setActiveCharacter}
          >
            <CharacterTabs characters={characters} />
            <div className="mt-8">
              {characters.map((character) => (
                <CharacterContent
                  key={character.name.toLowerCase().replace(/\s+/g, '')}
                  character={character}
                  isPlaying={isPlaying}
                  generatedText={generatedText}
                  onPlaybackComplete={handlePlaybackComplete}
                />
              ))}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
