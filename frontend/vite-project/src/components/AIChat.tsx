import React, { useState } from "react";

const mockAIAnswer = async (question: string) => {
  // Placeholder for real AI API call
  return `AI says: This is a mock answer to: "${question}"`;
};

const AIChat: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAnswer("");
    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }
    setLoading(true);
    try {
      const aiResponse = await mockAIAnswer(question);
      setAnswer(aiResponse);
    } catch (err: any) {
      setError("Failed to get answer from AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">AI Assistant</h2>
        <form onSubmit={handleAsk} className="mb-4">
          <input
            type="text"
            className="w-full p-2 border rounded mb-2"
            placeholder="Ask a question..."
            value={question}
            onChange={e => setQuestion(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Thinking..." : "Ask AI"}
          </button>
        </form>
        {error && <div className="mb-2 text-red-500">{error}</div>}
        {answer && <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded text-gray-900 dark:text-gray-100">{answer}</div>}
      </div>
    </div>
  );
};

export default AIChat; 