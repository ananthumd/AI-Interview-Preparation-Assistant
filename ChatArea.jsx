import { getScoreColor, getScoreBg } from "../utils/parser";

export default function ChatArea({ interview }) {
  const { messages, isLoading, sessionActive, chatRef } = interview;

  return (
    <div className="chat-area" ref={chatRef}>
      {!sessionActive && messages.length === 0 && <EmptyState />}

      {messages.map((msg) => (
        <Message key={msg.id} msg={msg} />
      ))}

      {isLoading && <TypingIndicator />}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#B5D4F4" strokeWidth="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
      <div className="empty-title">Ready when you are</div>
      <div className="empty-sub">
        Configure your role, interview type, and difficulty on the left — then hit <strong>Start Interview</strong> to begin.
      </div>
    </div>
  );
}

function Message({ msg }) {
  const isAI = msg.role === "ai";

  return (
    <div className={`message ${isAI ? "message-ai" : "message-user"}`}>
      <div className={`avatar ${isAI ? "avatar-ai" : "avatar-user"}`}>
        {isAI ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        )}
      </div>

      <div className={`bubble ${isAI ? "bubble-ai" : "bubble-user"}`}>
        <div dangerouslySetInnerHTML={{ __html: formatText(msg.content) }} />

        {msg.evaluation && <EvaluationCard eval={msg.evaluation} />}
      </div>
    </div>
  );
}

function EvaluationCard({ eval: ev }) {
  const scores = [
    { key: "relevance", label: "Relevance" },
    { key: "depth", label: "Depth" },
    { key: "clarity", label: "Clarity" },
  ];

  return (
    <div className="eval-card">
      <div className="eval-scores">
        {scores.map(({ key, label }) => {
          const val = ev.scores[key];
          return (
            <div key={key} className="score-pill" style={{ background: getScoreBg(val), color: getScoreColor(val) }}>
              <span className="score-num">{val}</span>
              <span className="score-label">/10</span>
              <span className="score-name">{label}</span>
            </div>
          );
        })}
      </div>

      {ev.strengths && (
        <div className="feedback-row feedback-good">
          <div className="feedback-tag">✓ Strengths</div>
          <div className="feedback-text">{ev.strengths}</div>
        </div>
      )}

      {ev.improve && (
        <div className="feedback-row feedback-improve">
          <div className="feedback-tag">↑ To improve</div>
          <div className="feedback-text">{ev.improve}</div>
        </div>
      )}

      {ev.nextQuestion && (
        <div className="next-q">
          <span className="next-q-label">Next →</span>
          <span className="next-q-text">{ev.nextQuestion}</span>
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="message message-ai">
      <div className="avatar avatar-ai">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>
      <div className="bubble bubble-ai">
        <div className="typing-dots">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}

function formatText(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br/>");
}
