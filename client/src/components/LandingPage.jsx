import React, { useState } from "react";
import { notesAPI } from "../services/api";
// Mock import - replace with actual import
const LandingPage = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setSummary("");

    try {
      console.log("Submitting prompt:", prompt);

      // Step 1: Create a note with proper structure (only content field needed)
      const noteResponse = await notesAPI.createNote({ content: prompt });
      console.log("Note created:", noteResponse.data);

      // Step 2: Summarize the note using the returned ID
      const summaryResponse = await notesAPI.summarizeNote(
        noteResponse.data._id
      );
      console.log("Summary generated:", summaryResponse.data);

      // Step 3: Set the summary to display to user
      setSummary(summaryResponse.data.summary);
    } catch (error) {
      console.error("Error processing request:", error);
      setError(
        error.response?.data?.message ||
          "An error occurred while processing your request."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative flex items-center justify-center p-4">
      {/* Ambient light effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-100/8 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-yellow-100/6 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light text-white mb-4 tracking-wide">
            Clarity
          </h1>
          <p className="text-yellow-100/70 text-lg font-light">
            Transform complex ideas into clear understanding
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Text Input */}
          <div className="relative group">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Paste your notes, articles, or any text here..."
              className="w-full h-56 p-6 bg-black/40 backdrop-blur-sm border border-yellow-200/20 rounded-2xl text-yellow-50 placeholder-yellow-100/50 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-200/40 focus:border-yellow-200/40 transition-all duration-300 text-base leading-relaxed"
              disabled={isLoading}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/5 to-transparent rounded-2xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-400/30 rounded-xl text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Summary Display */}
          {summary && (
            <div className="p-6 bg-yellow-200/10 border border-yellow-200/20 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-yellow-200 rounded-full animate-pulse"></div>
                <h3 className="text-yellow-100 font-medium">
                  ✨ AI Explanation
                </h3>
              </div>
              <div className="text-yellow-50/90 leading-relaxed">
                {summary.split("\n").map(
                  (paragraph, index) =>
                    paragraph.trim() && (
                      <p key={index} className="mb-3 last:mb-0">
                        {paragraph}
                      </p>
                    )
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-yellow-200/20">
                <button
                  onClick={() => setSummary("")}
                  className="text-yellow-200/60 hover:text-yellow-200/80 text-xs transition-colors duration-200"
                >
                  Clear explanation
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className={`w-full py-4 rounded-2xl font-medium text-lg transition-all duration-300 ${
              isLoading
                ? "bg-yellow-200/20 cursor-not-allowed text-yellow-100/60"
                : "bg-yellow-200/15 hover:bg-yellow-200/25 text-yellow-50 hover:shadow-lg hover:shadow-yellow-200/10 transform hover:-translate-y-0.5 border border-yellow-200/20"
            }`}
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-5 h-5 border-2 border-yellow-200 border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              "✨ Explain"
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-yellow-100/40 text-sm font-light">
            Powered by AI • Simple • Fast • Clear
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
