import { useVoice } from "../hooks/useVoice";

const QUICK_ACTIONS = [
  { label: "Hint", icon: "💡", text: "Can you give me a hint?" },
  { label: "Rephrase", icon: "↺", text: "Can you rephrase the question?" },
  { label: "Ideal answer", icon: "✦", text: "What would an ideal answer look like?" },
  { label: "Next question", icon: "→", text: "Please move on to the next question." },
  { label: "Explain more", icon: "?", text: "Can you explain what you're looking for?" },
];

export default function InputArea({ interview }) {
  const { inputText, setInputText, submitAnswer, isLoading, sessionActive } = interview;

  const { isRecording, toggleVoice, supported } = useVoice((transcript) => {
    setInputText(transcript);
  });

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitAnswer();
    }
  };

  const handleTextareaInput = (e) => {
    setInputText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 130) + "px";
  };

  const disabled = !sessionActive || isLoading;

  return (
    <div className="input-area">
      {sessionActive && (
        <div className="quick-actions">
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.label}
              className="quick-pill"
              onClick={() => submitAnswer(a.text)}
              disabled={disabled}
            >
              <span>{a.icon}</span> {a.label}
            </button>
          ))}
        </div>
      )}

      <div className="input-row">
        {supported && (
          <button
            className={`voice-btn ${isRecording ? "recording" : ""}`}
            onClick={toggleVoice}
            disabled={disabled}
            title={isRecording ? "Stop recording" : "Voice input"}
          >
            {isRecording ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#E24B4A">
                <rect x="6" y="6" width="12" height="12" rx="2"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            )}
          </button>
        )}

        <textarea
          value={inputText}
          onChange={handleTextareaInput}
          onKeyDown={handleKey}
          placeholder={
            isRecording
              ? "Listening…"
              : disabled
              ? "Start a session to begin answering…"
              : "Type your answer… (Enter to send, Shift+Enter for new line)"
          }
          disabled={disabled}
          rows={1}
        />

        <button
          className="send-btn"
          onClick={() => submitAnswer()}
          disabled={disabled || !inputText.trim()}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
