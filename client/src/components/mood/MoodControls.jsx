// src/components/mood/MoodControls.jsx
import { MOODS } from "./moodConfig.js";

export default function MoodControls({
  search,
  onSearchChange,
  onSearchSubmit,
  isLoading,
  errorMsg,
  currentMood,
  onChangeMood,
}) {
  return (
    <section className="space-y-4">
      {/* Search bar */}
      <form onSubmit={onSearchSubmit} className="flex gap-2">
        <input
          type="text"
          className="input input-bordered bg-base-100 flex-1"
          placeholder="Search for a track on Spotify..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading || !search.trim()}
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm mr-2" />
              Searching...
            </>
          ) : (
            "Search Spotify"
          )}
        </button>
      </form>

      {errorMsg && (
        <p className="text-xs text-error mt-1">{errorMsg}</p>
      )}

      {/* Mood pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs mt-2">
        <span className="text-base-content/70">Filter / jump mood:</span>
        {MOODS.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onChangeMood(m)}
            className={`badge cursor-pointer border border-base-300 capitalize ${
              currentMood === m
                ? "badge-primary text-primary-content"
                : "badge-ghost text-base-content/80 hover:bg-base-200"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <p className="text-[0.7rem] text-base-content/60">
        The board theme follows the mood of the song you're currently playing.
        You can also click a pill to quickly jump the vibe.
      </p>
    </section>
  );
}
