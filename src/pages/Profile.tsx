import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArtworkCard } from "@/components/ArtworkCard";

interface Artwork {
  id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
  token_id: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      } else {
        setUserEmail(session.user.email);
        fetchArtworks(session.user.id);
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchArtworks = async (userId: string) => {
    const { data, error } = await supabase
      .from('artworks')
      .select(`
        *,
        tokens (
          id,
          blockchain_status
        )
      `)
      .eq('creator_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setArtworks(data);
    }
  };

  const handleTokenize = async (artworkId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Refresh artworks after tokenization
      await fetchArtworks(session.user.id);
    } catch (error: any) {
      console.error("Error tokenizing artwork:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-2">
              Artist Profile
            </h1>
            {userEmail && (
              <p className="text-gray-600">{userEmail}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h2 className="font-heading text-xl font-semibold">Your Artworks</h2>
              </CardHeader>
              <CardContent>
                {artworks.length === 0 ? (
                  <p className="text-gray-600">No artworks submitted yet</p>
                ) : (
                  <div className="grid gap-4">
                    {artworks.map((artwork) => (
                      <ArtworkCard
                        key={artwork.id}
                        id={artwork.id}
                        title={artwork.title}
                        artist={userEmail || "Anonymous"}
                        imageUrl={artwork.image_url}
                        status={artwork.token_id ? "Tokenized" : undefined}
                        showTokenize={true}
                        onTokenize={handleTokenize}
                      />
                    ))}
                  </div>
                )}
                <Button 
                  className="mt-4" 
                  variant="outline"
                  onClick={() => navigate("/submit")}
                >
                  Submit New Artwork
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;