// src/components/mood/SongGrid.jsx
import { MOODS } from "./moodConfig.js";

export default function SongGrid({ songs, currentMood, onSave }) {
  if (!songs || songs.length === 0) return null;

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {songs.map((song) => (
        <div
          key={song.id}
          className="card card-compact bg-base-200/60 shadow-md hover:shadow-xl transition"
        >
          {song.image && (
            <figure className="bg-base-300">
              <img
                src={song.image}
                alt={song.title}
                className="w-full h-40 object-cover"
              />
            </figure>
          )}
          <div className="card-body">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="card-title text-sm">{song.title}</h3>
                <p className="text-xs text-base-content/70">
                  {song.artists}
                </p>
                <p className="text-[0.7rem] text-base-content/60">
                  {song.album}
                </p>
              </div>
              <span className="badge badge-outline text-[0.65rem]">
                {song.mood || currentMood || MOODS[0]}
              </span>
            </div>

            <div className="card-actions mt-3 justify-between items-center">
              {song.preview_url ? (
                <audio
                  controls
                  src={song.preview_url}
                  className="w-full"
                />
              ) : (
                <span className="text-[0.7rem] text-base-content/50">
                  No preview available
                </span>
              )}

              <button
                type="button"
                className="btn btn-sm btn-primary mt-2"
                onClick={() => onSave(song)}
              >
                Save to playlist
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
