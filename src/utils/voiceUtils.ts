import { supabase } from "@/integrations/supabase/client";

export const startVoiceRecognition = (
  onResult: (text: string) => void,
  onEnd: () => void
) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    onResult(text);
  };

  recognition.onend = onEnd;
  recognition.start();

  return recognition;
};

export const playWithElevenLabs = async (text: string) => {
  try {
    const { data: secrets } = await supabase
      .from('secrets')
      .select('key_value')
      .eq('key_name', 'ELEVEN_LABS_API_KEY')
      .maybeSingle();
    
    if (!secrets?.key_value) {
      throw new Error("ElevenLabs API key not found");
    }

    const VOICE_ID = "iP95p4xoKVk53GoZ742B"; // Chris's voice for JFK
    
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream/with-timestamps`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": secrets.key_value,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.3,
            similarity_boost: 0.85,
            style: 1.0,
            use_speaker_boost: true
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    return new Promise<void>((resolve) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      audio.play();
    });
  } catch (error) {
    console.error("ElevenLabs error:", error);
    throw error;
  }
};