// src/views/home.jsx
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { user, loginWithSpotify } = useAuth();

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <section className="mb-10">
        <h1 className="text-4xl font-extrabold mb-4">
          Turn your playlists into a <span className="text-primary">mood board</span>.
        </h1>
        <p className="text-lg opacity-80 mb-6">
          Connect Spotify, tag tracks with moods like <b>chill</b>, <b>focus</b>,
          <b> workout</b>, <b>sad</b>, or <b>party</b>, and watch the board theme
          change as you listen.
        </p>

        {user ? (
          <Link to="/moodboard" className="btn btn-primary btn-lg">
            Go to your mood board
          </Link>
        ) : (
          <button
            onClick={loginWithSpotify}
            className="btn btn-primary btn-lg"
          >
            Log in with Spotify
          </button>
        )}
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title text-primary">Create playlists</h2>
            <p>Organize your tracks by vibe, class project, or study session.</p>
          </div>
        </div>
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title text-secondary">Tag songs with moods</h2>
            <p>Each song gets a mood that drives the board&apos;s theme.</p>
          </div>
        </div>
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title text-accent">Live mood board</h2>
            <p>The board colors and pills update based on what&apos;s playing.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
