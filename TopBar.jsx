export default function TopBar({ interview }) {
  const { config, sessionActive, questionNum } = interview;
  const total = config.questionCount;
  const pct = total ? Math.round((Math.max(questionNum - 1, 0) / total) * 100) : 0;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-title">
          {sessionActive ? `${config.role} — ${config.type}` : "Configure your interview"}
        </div>
        {sessionActive && (
          <div className="progress-row">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: pct + "%" }} />
            </div>
            <span className="progress-label">Q{Math.max(questionNum - 1, 0)} / {total}</span>
          </div>
        )}
      </div>

      <div className="topbar-badges">
        {sessionActive && (
          <>
            <span className="badge badge-blue">{config.type}</span>
            <span className="badge badge-green">{config.difficulty}</span>
            {config.company && <span className="badge badge-gray">{config.company}</span>}
          </>
        )}
      </div>
    </header>
  );
}
