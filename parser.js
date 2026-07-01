/**
 * Parses structured JSON evaluation from Claude's response.
 * Returns null if no valid evaluation block is found.
 */
export function parseEvaluation(text) {
  const match = text.match(/```json\s*([\s\S]*?)```/);
  if (!match) return null;

  try {
    const data = JSON.parse(match[1]);
    if (!data.scores || !data.feedback) return null;

    return {
      feedback: data.feedback || "",
      scores: {
        relevance: clamp(data.scores.relevance),
        depth: clamp(data.scores.depth),
        clarity: clamp(data.scores.clarity),
      },
      strengths: data.strengths || "",
      improve: data.improve || "",
      nextQuestion: data.next_question || "",
    };
  } catch {
    return null;
  }
}

function clamp(val) {
  const n = parseInt(val, 10);
  return isNaN(n) ? 5 : Math.max(1, Math.min(10, n));
}

export function getScoreColor(score) {
  if (score >= 8) return "#3B6D11";
  if (score >= 6) return "#854F0B";
  return "#A32D2D";
}

export function getScoreBg(score) {
  if (score >= 8) return "#EAF3DE";
  if (score >= 6) return "#FAEEDA";
  return "#FCEBEB";
}

export function getGrade(avg) {
  if (avg >= 9) return { label: "Outstanding", color: "#3B6D11" };
  if (avg >= 7.5) return { label: "Strong", color: "#185FA5" };
  if (avg >= 6) return { label: "Good", color: "#854F0B" };
  if (avg >= 4) return { label: "Needs Work", color: "#A32D2D" };
  return { label: "Struggling", color: "#791F1F" };
}
