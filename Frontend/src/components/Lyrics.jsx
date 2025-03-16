import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MusicIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8 text-black drop-shadow-lg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z"
    />
  </svg>
);

const Lyrics = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lyrics, setLyrics] = useState("");
  const [correctTitle, setCorrectTitle] = useState("");
  const [guess, setGuess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const generateLyrics = async () => {
    setIsGenerating(true);
    setLyrics("");
    setErrorMessage("");

    try {
      const response = await fetch("https://ai-lyric-generator.onrender.com/generate-lyrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (data.lyrics && data.title) {
        setLyrics(data.lyrics);
        setCorrectTitle(data.title);
        toast.success("Lyrics generated successfully! 🎶");
      } else {
        throw new Error("No lyrics received");
      }
    } catch (error) {
      console.error("Error fetching lyrics:", error);
      setErrorMessage("Failed to generate lyrics. Try again.");
      toast.error("Failed to generate lyrics. Try again.");
    }

    setIsGenerating(false);
  };

  const checkGuess = () => {
    if(!lyrics.trim()){
      toast.error("Please generate lyric first");
      return;
    }
    if(guess.trim()===""){
      toast.error("Please type the song and generate lyric");
      return;
    }
    if (guess.trim().toLowerCase() === correctTitle.toLowerCase()) {
      toast.success("Correct! 🎉 You guessed it!");
    } else {
      toast.error(`Oops! The correct answer was: ${correctTitle}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 text-white flex flex-col items-center p-4 sm:p-6">
      <h1 className="flex flex-wrap items-center justify-center gap-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl bg-white p-4 sm:p-5 md:p-6 rounded-lg text-black font-extrabold drop-shadow-lg mb-3 sm:mb-5">
        <MusicIcon /> AI Lyrics Generator
      </h1>
      <button
        onClick={generateLyrics}
        className={`px-5 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-base sm:text-lg transition-all bg-gradient-to-r from-red-500 to-pink-500 shadow-md hover:scale-105 hover:shadow-lg ${
          isGenerating ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isGenerating}
      >
        {isGenerating ? "Generating..." : "Generate Lyrics"}
      </button>

      {errorMessage && <p className="mt-3 text-red-400 font-semibold text-sm sm:text-base">{errorMessage}</p>}

      <div className="w-full max-w-2xl mt-6 p-4 sm:p-5 border border-gray-300 rounded-xl bg-gray-700 text-white">
        <h2 className="text-center text-lg sm:text-xl font-semibold mb-3">Generated Lyrics</h2>
        <textarea
          value={lyrics}
          placeholder="Generated lyrics will appear here..."
          className="w-full h-32 sm:h-40 p-3 bg-gray-800 border border-gray-500 rounded-md text-gray-300 focus:ring-2 focus:ring-red-400 outline-none"
          readOnly
        />
      </div>

      <div className="w-full max-w-2xl mt-6 p-5 sm:p-6 bg-gray-700 rounded-lg border-2 sm:border-4 border-red-600 text-center">
        <h2 className="text-base sm:text-lg font-bold mb-3">Guess the Song</h2>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter song name"
          className="w-full p-2 sm:p-3 border border-gray-500 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-red-400"
        />
        <button
          onClick={checkGuess}
          className="mt-4 px-4 sm:px-6 py-2 sm:py-3 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-lg"
        >
          Submit Guess
        </button>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Lyrics;