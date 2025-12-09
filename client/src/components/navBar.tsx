import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isMoodboard = location.pathname.startsWith("/moodboard");
  const isPlaylists = location.pathname.startsWith("/playlists");

  return (
    <div className="navbar bg-base-100 border-b border-base-200">
      <div className="flex-1">
        <Link to="/moodboard" className="btn btn-ghost normal-case text-xl">
          HouseHub · MoodBoard
        </Link>
      </div>

      {user && (
        <div className="flex-none gap-2 items-center">
          <ul className="menu menu-horizontal px-1 text-sm">
            <li>
              <Link
                to="/moodboard"
                className={isMoodboard ? "font-semibold" : ""}
              >
                Moodboard
              </Link>
            </li>
            <li>
              <Link
                to="/playlists"
                className={isPlaylists ? "font-semibold" : ""}
              >
                Playlists
              </Link>
            </li>
          </ul>

          <span className="text-xs text-base-content/60 hidden md:inline">
            {user.spotify_email || user.email}
          </span>

          <button
            type="button"
            onClick={logout}
            className="btn btn-ghost btn-xs"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
