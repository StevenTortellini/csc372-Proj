// src/App.jsx
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/navBar.jsx";
import Home from "./views/home.jsx";
import Login from "./views/login.jsx";
import MoodBoard from "./views/moodBoard.jsx";
import PlaylistsView from "./views/playlists.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <div data-theme="lofi" className="min-h-screen bg-base-100 text-base-content">
      <NavBar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/moodboard"
          element={
            <ProtectedRoute>
              <MoodBoard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/playlists"
          element={
            <ProtectedRoute>
              <PlaylistsView />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
