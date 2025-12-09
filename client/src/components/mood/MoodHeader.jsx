// src/components/mood/MoodHeader.jsx
import { Link } from "react-router-dom";
import { moodTheme } from "./moodConfig.js";

export default function MoodHeader({ currentMood }) {
  const theme = moodTheme[currentMood] || moodTheme.chill;

  return (
    <>
      {/* Top navbar */}
      <nav className="navbar bg-base-100/90 backdrop-blur shadow-sm px-4">
        <div className="flex-1">
          <span className="font-semibold tracking-wide">
            HouseHub · Music Mood Board
          </span>
        </div>

       
      </nav>

      {/* Page header inside gradient */}
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Mood Board</h1>
          <span className={`badge ${theme.badge} capitalize`}>
            {currentMood}
          </span>
        </div>

        <p className="mt-2 text-sm text-base-content/80">
          Welcome,&nbsp;
          <span className={theme.accent}>Spotify user</span>. Search Spotify
          tracks, tag them with moods in your playlists, and let the currently
          playing song change the vibe of your board.
        </p>
      </header>
    </>
  );
}
