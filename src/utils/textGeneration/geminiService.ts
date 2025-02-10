
import { supabase } from "@/integrations/supabase/client";

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export const generateWithGemini = async (prompt: string): Promise<string> => {
  try {
    console.log('Starting Gemini API request process...');
    
    // Call the edge function to get the response
    const { data: response, error } = await supabase.functions.invoke('generate-with-gemini', {
      body: { prompt }
    });

    if (error) {
      console.error('Error calling Gemini edge function:', error);
      throw new Error(`Failed to call Gemini edge function: ${error.message}`);
    }

    if (!response?.generatedText) {
      console.error('Invalid response format from edge function:', response);
      throw new Error('Invalid response format from edge function');
    }

    console.log('Successfully generated text (length):', response.generatedText.length);
    return response.generatedText;
  } catch (error) {
    console.error('Error in Gemini generation:', error);
    throw error;
  }
};
