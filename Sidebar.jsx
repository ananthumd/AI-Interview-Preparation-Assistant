import ScoreSummary from "./ScoreSummary";

const ROLES = [
  "Software Engineer", "Frontend Developer", "Backend Developer",
  "Full Stack Developer", "Data Scientist", "ML Engineer",
  "DevOps Engineer", "Product Manager", "QA Engineer", "Mobile Developer",
];

const TYPES = ["Technical", "Behavioral", "System Design", "HR Screening", "Mixed"];
const DIFFICULTIES = ["Junior", "Mid-level", "Senior", "Staff/Principal"];
const Q_COUNTS = [3, 5, 7, 10];

export default function Sidebar({ interview }) {
  const { config, setConfig, sessionActive, startSession, resetSession, scores, avgScore } = interview;

  const update = (key) => (e) => setConfig((c) => ({ ...c, [key]: e.target.value }));

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"/>
            <path d="M12 8v4l3 3"/>
          </svg>
        </div>
        <span>Interview AI</span>
      </div>

      <div className="config-block">
        <div className="config-label">Configure Session</div>

        <div className="field">
          <label>Role</label>
          <select value={config.role} onChange={update("role")} disabled={sessionActive}>
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>

        <div className="field">
          <label>Interview type</label>
          <select value={config.type} onChange={update("type")} disabled={sessionActive}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div className="field">
          <label>Difficulty</label>
          <select value={config.difficulty} onChange={update("difficulty")} disabled={sessionActive}>
            {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>

        <div className="field">
          <label>Questions</label>
          <select value={config.questionCount} onChange={(e) => setConfig(c => ({ ...c, questionCount: +e.target.value }))} disabled={sessionActive}>
            {Q_COUNTS.map((n) => <option key={n} value={n}>{n} questions</option>)}
          </select>
        </div>

        <div className="field">
          <label>Company <span className="opt">(optional)</span></label>
          <input
            type="text"
            placeholder="e.g. Google, Amazon…"
            value={config.company}
            onChange={update("company")}
            disabled={sessionActive}
          />
        </div>

        {!sessionActive ? (
          <button className="btn-primary" onClick={startSession}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Start Interview
          </button>
        ) : (
          <button className="btn-secondary" onClick={resetSession}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            New Session
          </button>
        )}
      </div>

      {scores.length > 0 && (
        <ScoreSummary scores={scores} avgScore={avgScore} config={config} />
      )}
    </aside>
  );
}
