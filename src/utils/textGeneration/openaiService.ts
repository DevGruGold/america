import { supabase } from "@/integrations/supabase/client";

export const generateWithOpenAI = async (prompt: string): Promise<string> => {
  try {
    const { data: secretData } = await supabase
      .from('secrets')
      .select('key_value')
      .eq('key_name', 'OPENAI_API_KEY')
      .maybeSingle();

    if (!secretData) {
      throw new Error('OpenAI API key not found');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretData.key_value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a historical figure simulation. Respond in character based on the provided context.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI generation error:', error);
    throw error;
  }
};