// 👇 Optional (prevents TS error for gtag)
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const isCorrectAnswer = (selected: number, correct: number): boolean => {
  return selected === correct;
};

export const calculatePercentage = (score: number, total: number): number => {
  if (total <= 0) return 0;
  return Math.round((score / total) * 100);
};

export const getQuizFeedback = (score: number, total: number): string => {
  // 🔥 Track quiz completion event
  window.gtag?.("event", "quiz_completed", {
    event_category: "engagement",
    score,
    total,
    percentage: total > 0 ? Math.round((score / total) * 100) : 0,
  });

  if (score === total) return "Perfect score! You're ready to vote.";
  if (score >= total * 0.6) return "Great job! Brush up and you'll ace it next time.";
  return "Good start. Try the Learn page and come back!";
};
