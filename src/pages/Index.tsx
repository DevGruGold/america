import { Navigation } from "@/components/Navigation";
import { ArtworkCard } from "@/components/ArtworkCard";
import { HistoricalCharacters } from "@/components/HistoricalCharacters";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Artwork {
  id: string;
  title: string;
  image_url: string;
  creator_id: string;
  creator_profile: {
    display_name: string | null;
  } | null;
}

const Index = () => {
  const { data: artworks } = useQuery({
    queryKey: ['artworks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artworks')
        .select(`
          id,
          title,
          image_url,
          creator_id,
          creator_profile:profiles!creator_id(display_name)
        `)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data as Artwork[];
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4">
        {/* Hero Section with Chat */}
        <section className="py-8 md:py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary mb-4 animate-fade-in">
                Kennedy Center Digital Arts
              </h1>
              <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto md:mx-0 mb-6 animate-fade-in">
                Experience groundbreaking AI technology bringing history to life through interactive conversations with legendary figures.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button 
                  onClick={() => document.getElementById('chat-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Start Chatting
                </button>
                <button 
                  onClick={() => document.getElementById('artworks-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-secondary text-primary px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors"
                >
                  View Artworks
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="/placeholder.svg" 
                alt="Kennedy Center Digital Arts"
                className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Chat Section */}
        <section id="chat-section" className="mb-16">
          <HistoricalCharacters />
        </section>

        {/* Partnership Section */}
        <section className="py-12 md:py-16 bg-white rounded-lg shadow-sm mb-16">
          <div className="text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-4">
              In Partnership with the Smithsonian
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              A groundbreaking collaboration between the Kennedy Center and the Smithsonian Institution,
              bringing together arts and innovation.
            </p>
          </div>
        </section>

        {/* Artworks Section */}
        <section id="artworks-section" className="mb-16">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-8 text-center">
            Featured Digital Artworks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {artworks && artworks.length > 0 ? (
              artworks.map((artwork) => (
                <ArtworkCard
                  key={artwork.id}
                  title={artwork.title}
                  artist={artwork.creator_profile?.display_name || "Anonymous"}
                  imageUrl={artwork.image_url}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No artworks submitted yet</p>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-primary text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm md:text-base">© 2024 Kennedy Center Digital Art Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;