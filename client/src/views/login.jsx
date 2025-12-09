// src/views/login.jsx
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";

export default function Login() {
  const { user, loginWithSpotify } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/moodboard";

  if (user) {
    // already logged in, just tell them where to go
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <p className="mb-4 text-lg">
          You&apos;re already logged in.
        </p>
        <Link to={from} className="btn btn-primary">
          Go to your mood board
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Login with Spotify</h1>
      <p className="mb-6 opacity-80">
        We use Spotify OAuth for authentication. No password needed.
      </p>
      <button onClick={loginWithSpotify} className="btn btn-primary btn-lg">
        Continue with Spotify
      </button>
    </div>
  );
}
