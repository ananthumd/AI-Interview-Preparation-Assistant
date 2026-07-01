import { useState, useRef, useCallback } from "react";

export function useVoice(onTranscript) {
  const [isRecording, setIsRecording] = useState(false);
  const [supported] = useState(
    () => "webkitSpeechRecognition" in window || "SpeechRecognition" in window
  );
  const recRef = useRef(null);

  const toggleVoice = useCallback(() => {
    if (!supported) {
      alert("Voice input requires Chrome or Edge browser.");
      return;
    }

    if (isRecording) {
      recRef.current?.stop();
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";
    recRef.current = rec;

    rec.onstart = () => setIsRecording(true);
    rec.onend = () => setIsRecording(false);
    rec.onerror = () => setIsRecording(false);

    rec.onresult = (e) => {
      let transcript = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      onTranscript(transcript);
    };

    rec.start();
  }, [isRecording, supported, onTranscript]);

  return { isRecording, toggleVoice, supported };
}
