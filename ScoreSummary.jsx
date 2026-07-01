import { getGrade, getScoreColor, getScoreBg } from "../utils/parser";

export default function ScoreSummary({ scores, avgScore, config }) {
  const overall = Math.round((avgScore("relevance") + avgScore("depth") + avgScore("clarity")) / 3);
  const grade = getGrade(overall);

  return (
    <div className="score-summary">
      <div className="summary-header">Session Score</div>

      <div className="overall-score" style={{ color: grade.color }}>
        <span className="overall-num">{overall}</span>
        <span className="overall-denom">/10</span>
        <span className="overall-grade" style={{ background: getScoreBg(overall), color: grade.color }}>
          {grade.label}
        </span>
      </div>

      <div className="score-breakdown">
        {[
          { key: "relevance", label: "Relevance" },
          { key: "depth", label: "Depth" },
          { key: "clarity", label: "Clarity" },
        ].map(({ key, label }) => {
          const val = avgScore(key);
          return (
            <div key={key} className="breakdown-row">
              <span className="breakdown-label">{label}</span>
              <div className="breakdown-bar-track">
                <div
                  className="breakdown-bar-fill"
                  style={{ width: val * 10 + "%", background: getScoreColor(val) }}
                />
              </div>
              <span className="breakdown-val" style={{ color: getScoreColor(val) }}>{val}</span>
            </div>
          );
        })}
      </div>

      <div className="summary-meta">
        {scores.length} answer{scores.length !== 1 ? "s" : ""} evaluated · {config.role}
      </div>
    </div>
  );
}
