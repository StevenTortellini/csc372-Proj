// src/views/moodBoard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import MoodHeader from "../components/mood/MoodHeader.jsx";
import MoodControls from "../components/mood/MoodControls.jsx";
import SongGrid from "../components/mood/SongGrid.jsx";
import SaveSongModal from "../components/mood/SaveSongModal.jsx";
import { MOODS, moodTheme } from "../components/mood/moodConfig.js";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";

export default function MoodBoard() {
  const [search, setSearch] = useState("");
  const [songs, setSongs] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [currentMood, setCurrentMood] = useState("chill");

  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [playlistError, setPlaylistError] = useState("");

  const [selectedTrack, setSelectedTrack] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

  // -------- Load playlists on mount --------
  useEffect(() => {
    async function loadPlaylists() {
      try {
        const res = await fetch(`${API_BASE}/playlists`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load playlists");
        const data = await res.json();
        const list = data.playlists || data || [];
        setPlaylists(list);
      } catch (err) {
        console.error("Error loading playlists:", err);
        setPlaylistError("Failed to load playlists");
        setPlaylists([]);
      }
    }
    loadPlaylists();
  }, []);

  // -------- Search Spotify via backend --------
  async function handleSearchSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    if (!search.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/spotify/search?q=${encodeURIComponent(
          search.trim()
        )}`,
        { credentials: "include" }
      );

      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();
      let results = Array.isArray(data) ? data : data.results || [];

      if (!results[0]?.mood) {
        results = results.map((t, i) => ({
          ...t,
          mood: MOODS[i % MOODS.length],
        }));
      }

      setSongs(results);
    } catch (err) {
      console.error("Spotify search error:", err);
      setErrorMsg("Something went wrong searching Spotify.");
    } finally {
      setIsLoading(false);
    }
  }

  // -------- Create playlist --------
  async function handleCreatePlaylist(e) {
    e.preventDefault();
    setPlaylistError("");

    const name = newPlaylistName.trim();
    if (!name) return;

    setCreatingPlaylist(true);
    try {
      const res = await fetch(`${API_BASE}/playlists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Failed to create playlist");

      const data = await res.json();
      const playlist = data.playlist || data;
      setPlaylists((prev) => [...prev, playlist]);
      setNewPlaylistName("");
    } catch (err) {
      console.error("Create playlist error:", err);
      setPlaylistError("Could not create playlist.");
    } finally {
      setCreatingPlaylist(false);
    }
  }

  // -------- Delete playlist from this quick list --------
  async function handleDeletePlaylist(id) {
    try {
      const res = await fetch(`${API_BASE}/playlists/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete playlist");
      setPlaylists((prev) => prev.filter((pl) => pl.id !== id));
    } catch (err) {
      console.error("Delete playlist error:", err);
      setPlaylistError("Failed to delete playlist.");
    }
  }

  // -------- Save modal open/close --------
  function handleOpenSaveModal(track) {
    setSelectedTrack(track);
    setShowSaveModal(true);
  }

  function handleCloseSaveModal() {
    setShowSaveModal(false);
    setSelectedTrack(null);
  }

  const theme = moodTheme[currentMood];

  return (
    <div
      className={`min-h-screen transition-all duration-500 bg-gradient-to-b ${theme.bg} text-white`}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        <MoodHeader currentMood={currentMood} />

        <MoodControls
          search={search}
          onSearchChange={setSearch}
          onSearchSubmit={handleSearchSubmit}
          isLoading={isLoading}
          errorMsg={errorMsg}
          currentMood={currentMood}
          onChangeMood={setCurrentMood}
        />

        {/* Playlists quick section */}
        <div className="mt-6 border border-base-300/40 rounded-xl p-4 bg-base-100/5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Your playlists</h3>
            <Link
              to="/playlists"
              className="text-xs link link-hover text-base-content/70"
            >
              View &amp; manage playlists
            </Link>
          </div>

          {playlists.length === 0 && (
            <p className="text-xs text-base-content/70 mb-2">
              No playlists yet. Create one to start saving songs.
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-3">
            {playlists.map((pl) => (
              <div
                key={pl.id}
                className="badge badge-outline badge-primary gap-1 items-center"
              >
                <span>{pl.name}</span>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs px-1"
                  onClick={() => handleDeletePlaylist(pl.id)}
                  aria-label="Delete playlist"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleCreatePlaylist}
            className="flex flex-col md:flex-row gap-2"
          >
            <input
              type="text"
              className="input input-sm input-bordered flex-1 bg-base-100 text-black"
              placeholder="New playlist name..."
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-sm btn-secondary"
              disabled={creatingPlaylist}
            >
              {creatingPlaylist ? "Creating..." : "Create playlist"}
            </button>
          </form>
          {playlistError && (
            <p className="mt-1 text-xs text-error">{playlistError}</p>
          )}
        </div>

        {/* Search results */}
        <div className="mt-8">
          {songs.length === 0 ? (
            <p className="text-sm text-base-content/70">
              No songs loaded yet. Try searching for a track above. Once your
              playlist + moods are wired to the backend, songs for each mood
              will appear here automatically.
            </p>
          ) : (
            <SongGrid
              songs={songs}
              currentMood={currentMood}
              onSave={handleOpenSaveModal}
            />
          )}
        </div>
      </div>

      {showSaveModal && selectedTrack && (
        <SaveSongModal
          track={selectedTrack}
          playlists={playlists}
          onClose={handleCloseSaveModal}
        />
      )}
    </div>
  );
}
