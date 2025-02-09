
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Character } from "@/types/historical";
import { Tabs } from "@/components/ui/tabs";
import { CharacterTabs } from "./characters/CharacterTabs";
import { CharacterContent } from "./characters/CharacterContent";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const FEATURED_CHARACTERS = ["John F. Kennedy", "Frederick Douglass", "Abraham Lincoln"];

async function fetchHistoricalFigures(): Promise<Character[]> {
  const { data, error } = await supabase
    .from('historical_figures')
    .select('*')
    .order('name');
    
  if (error) {
    throw new Error('Failed to fetch historical figures');
  }

  // Organize characters: featured ones first, then others
  const characters = data.map(figure => ({
    id: figure.id,
    name: figure.name,
    role: figure.role,
    nationality: figure.nationality,
    era: figure.era,
    imageUrl: figure.image_url,
    description: figure.description,
    voiceId: figure.voice_id,
    prompt: figure.prompt
  }));

  // Sort so featured characters appear first
  return characters.sort((a, b) => {
    const aFeatured = FEATURED_CHARACTERS.includes(a.name);
    const bFeatured = FEATURED_CHARACTERS.includes(b.name);
    if (aFeatured && !bFeatured) return -1;
    if (!aFeatured && bFeatured) return 1;
    return a.name.localeCompare(b.name);
  });
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
        title: "Historical Figures Ready",
        description: "Featured figures and additional historical personalities are ready for interaction.",
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

  const featuredCharacters = characters.filter(char => FEATURED_CHARACTERS.includes(char.name));
  const otherCharacters = characters.filter(char => !FEATURED_CHARACTERS.includes(char.name));

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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {featuredCharacters.map((character) => (
            <div key={character.name} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">{character.name}</h3>
              <div className="flex items-center gap-4">
                <img 
                  src={character.imageUrl} 
                  alt={character.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <p className="text-gray-600 mb-2">{character.role}</p>
                  <p className="text-sm text-gray-500">{character.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <h3 className="text-2xl font-semibold mb-6">Additional Historical Figures</h3>
          <Tabs 
            defaultValue={characters[0]?.name.toLowerCase().replace(/\s+/g, '')} 
            className="w-full" 
            onValueChange={setActiveCharacter}
          >
            <CharacterTabs characters={otherCharacters} />
            <div className="mt-8">
              {otherCharacters.map((character) => (
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

// Export characters query function to be used by other components
export const useHistoricalFigures = () => {
  return useQuery({
    queryKey: ['historical-figures'],
    queryFn: fetchHistoricalFigures,
  });
};
