import { useState, useRef, useCallback } from "react";
import { callClaude } from "../utils/api";
import { buildSystemPrompt } from "../utils/prompts";
import { parseEvaluation } from "../utils/parser";

export function useInterview() {
  const [config, setConfig] = useState({
    role: "Software Engineer",
    type: "Technical",
    difficulty: "Mid-level",
    company: "",
    questionCount: 5,
  });

  const [sessionActive, setSessionActive] = useState(false);
  const [messages, setMessages] = useState([]);          // displayed messages
  const [apiMessages, setApiMessages] = useState([]);    // raw API conversation
  const [isLoading, setIsLoading] = useState(false);
  const [questionNum, setQuestionNum] = useState(0);
  const [scores, setScores] = useState([]);
  const [inputText, setInputText] = useState("");
  const chatRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, 50);
  };

  const addMessage = useCallback((role, content, evaluation = null) => {
    setMessages((prev) => [...prev, { id: Date.now(), role, content, evaluation }]);
    scrollToBottom();
  }, []);

  const startSession = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setSessionActive(true);
    setMessages([]);
    setApiMessages([]);
    setQuestionNum(1);
    setScores([]);

    const systemPrompt = buildSystemPrompt(config);
    const initMsg = [{ role: "user", content: "Please start the interview now." }];

    try {
      const reply = await callClaude(systemPrompt, initMsg);
      setApiMessages([...initMsg, { role: "assistant", content: reply }]);
      addMessage("ai", reply);
    } catch (e) {
      addMessage("ai", "⚠️ Could not connect to AI. Check your API key in `.env` and try again.");
    }
    setIsLoading(false);
  }, [config, isLoading, addMessage]);

  const submitAnswer = useCallback(async (text) => {
    const trimmed = (text || inputText).trim();
    if (!trimmed || isLoading || !sessionActive) return;

    setInputText("");
    setIsLoading(true);
    addMessage("user", trimmed);

    const newApiMessages = [...apiMessages, { role: "user", content: trimmed }];
    const systemPrompt = buildSystemPrompt(config);

    try {
      const reply = await callClaude(systemPrompt, newApiMessages);
      const updated = [...newApiMessages, { role: "assistant", content: reply }];
      setApiMessages(updated);

      const evaluation = parseEvaluation(reply);
      if (evaluation) {
        setScores((prev) => [...prev, evaluation.scores]);
        setQuestionNum((n) => Math.min(n + 1, config.questionCount));
        addMessage("ai", evaluation.feedback, evaluation);
      } else {
        addMessage("ai", reply);
      }
    } catch (e) {
      addMessage("ai", "⚠️ Something went wrong. Please try again.");
    }
    setIsLoading(false);
  }, [inputText, isLoading, sessionActive, apiMessages, config, addMessage]);

  const resetSession = useCallback(() => {
    setSessionActive(false);
    setMessages([]);
    setApiMessages([]);
    setQuestionNum(0);
    setScores([]);
    setInputText("");
    setIsLoading(false);
  }, []);

  const avgScore = (key) =>
    scores.length ? Math.round(scores.reduce((a, s) => a + (s[key] || 0), 0) / scores.length) : 0;

  return {
    config, setConfig,
    sessionActive,
    messages,
    isLoading,
    questionNum,
    scores,
    inputText, setInputText,
    chatRef,
    startSession,
    submitAnswer,
    resetSession,
    avgScore,
  };
}
