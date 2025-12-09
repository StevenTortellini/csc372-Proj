// src/components/mood/SaveSongModal.jsx
import { useState } from "react";
import { MOODS } from "./moodConfig.js";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";

export default function SaveSongModal({ track, playlists, onClose, onSaved }) {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [mood, setMood] = useState(track?.mood || "chill");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!track) return null;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedPlaylistId && !newPlaylistName.trim()) {
      setErrorMsg("Choose a playlist or enter a new playlist name.");
      return;
    }

    setIsSaving(true);
    setErrorMsg("");

    try {
      let playlistId = selectedPlaylistId;

      // 1) create playlist if needed
      if (!playlistId) {
        const resPl = await fetch(`${API_BASE}/playlists`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name: newPlaylistName.trim() }),
        });

        if (!resPl.ok) throw new Error("Failed to create playlist");

        const dataPl = await resPl.json();
        const plObj = dataPl.playlist || dataPl;
        playlistId = plObj.id;
      }

      // 2) save song
      const resSong = await fetch(`${API_BASE}/songs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          playlist_id: Number(playlistId),
          title: track.title,
          artist: track.artist || track.artists,
          album: track.album || null,
          api_id: track.id,
          mood,
        }),
      });

      if (!resSong.ok) {
        let body = {};
        try {
          body = await resSong.json();
        } catch {}
        console.error("Save song failed", body);
        throw new Error("Failed to save song");
      }

      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to save this song. Try again.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleClose() {
    if (!isSaving) onClose();
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box bg-base-200 text-base-content">
        <form method="dialog" className="absolute right-3 top-3">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost"
            onClick={handleClose}
          >
            ✕
          </button>
        </form>

        <h3 className="font-bold text-lg mb-1">Save to playlist</h3>
        <p className="text-xs text-base-content/70 mb-3">
          {track.title} · {track.artist || track.artists}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Existing playlists */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm">
                Choose an existing playlist
              </span>
            </label>
            <select
              className="select select-bordered w-full bg-base-100 text-base-content"
              value={selectedPlaylistId}
              onChange={(e) => setSelectedPlaylistId(e.target.value)}
            >
              <option value="">-- None / create new --</option>
              {playlists.map((pl) => (
                <option key={pl.id} value={pl.id}>
                  {pl.title || pl.name}
                </option>
              ))}
            </select>
          </div>

          {/* New playlist */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm">
                Or create a new playlist
              </span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full bg-base-100 text-base-content"
              placeholder="New playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
            />
            <label className="label">
              <span className="label-text-alt text-[0.7rem] text-base-content/60">
                If you select a playlist above, this field is ignored.
              </span>
            </label>
          </div>

          {/* Mood selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm">
                Mood for this song in the playlist
              </span>
            </label>
            <select
              className="select select-bordered w-full bg-base-100 text-base-content capitalize"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
            >
              {MOODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {errorMsg && <p className="text-xs text-error">{errorMsg}</p>}

          <div className="modal-action">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleClose}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
