// src/views/PlaylistsView.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";

export default function PlaylistsView() {
  const [playlists, setPlaylists] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [renameName, setRenameName] = useState("");
  const [renamingId, setRenamingId] = useState(null);

  // load all playlists
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/playlists`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load playlists");
        const data = await res.json();
        const list = data.playlists || data || [];
        setPlaylists(list);
        if (list.length > 0) {
          setActiveId(list[0].id);
        }
      } catch (err) {
        console.error("PlaylistsView load error:", err);
        setErrorMsg("Failed to load playlists.");
      }
    }
    load();
  }, []);

  // load songs when active playlist changes
  useEffect(() => {
    if (!activeId) {
      setSongs([]);
      return;
    }

    async function loadSongs() {
      setLoadingSongs(true);
      setErrorMsg("");
      try {
        const res = await fetch(`${API_BASE}/playlists/${activeId}/songs`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load songs");
        const data = await res.json();
        setSongs(data.songs || []);
      } catch (err) {
        console.error("PlaylistsView songs error:", err);
        setErrorMsg("Error: failed to load songs for playlist.");
        setSongs([]);
      } finally {
        setLoadingSongs(false);
      }
    }

    loadSongs();
  }, [activeId]);

  // delete playlist
  async function handleDeletePlaylist(id) {
    if (!window.confirm("Delete this playlist? This cannot be undone.")) return;
    try {
      const res = await fetch(`${API_BASE}/playlists/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete playlist");
      setPlaylists((prev) => prev.filter((pl) => pl.id !== id));
      if (id === activeId) {
        // pick a new active if possible
        const remaining = playlists.filter((pl) => pl.id !== id);
        setActiveId(remaining.length > 0 ? remaining[0].id : null);
        setSongs([]);
      }
    } catch (err) {
      console.error("Delete playlist error:", err);
      setErrorMsg("Failed to delete playlist.");
    }
  }

  // start rename (edit title)
  function startRename(pl) {
    setRenamingId(pl.id);
    // use title from backend, not name
    setRenameName(pl.title || "");
  }

  // commit rename
  async function submitRename(e) {
    e.preventDefault();
    if (!renamingId) return;

    const title = renameName.trim();
    if (!title) return;

    try {
      const res = await fetch(`${API_BASE}/playlists/${renamingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        // backend should expect { title, description? }
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to rename playlist");
      const data = await res.json();
      const updated = data.playlist || data;

      setPlaylists((prev) =>
        prev.map((pl) => (pl.id === updated.id ? updated : pl))
      );
      setRenamingId(null);
      setRenameName("");
    } catch (err) {
      console.error("Rename playlist error:", err);
      setErrorMsg("Failed to rename playlist.");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* small crumb: only Moodboard link */}
      <div className="flex justify-end mb-4 text-xs text-base-content/60">
        <Link to="/moodboard" className="link link-hover">
          Moodboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-1">Your Playlists</h1>
      <p className="text-sm text-base-content/70 mb-4">
        View, rename, and delete playlists. Click a playlist to see its songs.
      </p>

      {errorMsg && (
        <p className="text-sm text-error mb-3">{errorMsg}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[260px,1fr] gap-4">
        {/* left: playlists list */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body py-3">
            <h2 className="text-sm font-semibold mb-2">
              Playlists ({playlists.length})
            </h2>
            <div className="flex flex-col gap-1">
              {playlists.map((pl) => (
                <div
                  key={pl.id}
                  className={`flex items-center justify-between px-2 py-1 rounded-md text-sm ${
                    pl.id === activeId
                      ? "bg-primary text-primary-content"
                      : "hover:bg-base-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveId(pl.id)}
                    className="flex-1 text-left truncate"
                  >
                    {pl.title}
                  </button>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs"
                      onClick={() => startRename(pl)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs text-error"
                      onClick={() => handleDeletePlaylist(pl.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {playlists.length === 0 && (
                <p className="text-xs text-base-content/60">
                  No playlists yet. Go to the Moodboard to create one.
                </p>
              )}
            </div>

            {renamingId && (
              <form onSubmit={submitRename} className="mt-3 flex gap-2">
                <input
                  type="text"
                  className="input input-xs input-bordered flex-1"
                  value={renameName}
                  onChange={(e) => setRenameName(e.target.value)}
                  placeholder="New playlist title"
                />
                <button type="submit" className="btn btn-xs btn-primary">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-xs"
                  onClick={() => {
                    setRenamingId(null);
                    setRenameName("");
                  }}
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>

        {/* right: songs for active playlist (read-only) */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body py-3">
            {activeId == null ? (
              <p className="text-sm text-base-content/70">
                Select a playlist on the left to view its songs.
              </p>
            ) : loadingSongs ? (
              <p className="text-sm text-base-content/70">
                Loading songs...
              </p>
            ) : songs.length === 0 ? (
              <p className="text-sm text-base-content/70">
                This playlist is empty. Add songs from the Moodboard.
              </p>
            ) : (
              <div className="space-y-2">
                {songs.map((song) => (
                  <div
                    key={song.id}
                    className="flex items-center justify-between gap-3 border-b border-base-200 pb-2 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      {song.image_url && (
                        <img
                          src={song.image_url}
                          alt={song.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium">
                          {song.title}
                        </div>
                        <div className="text-xs text-base-content/70">
                          {song.artist} · {song.album}
                          {song.mood && (
                            <span className="ml-2 badge badge-outline badge-xs">
                              {song.mood}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Songs are read-only here: no Remove button */}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
