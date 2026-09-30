import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./Navbar.css";

function Navbar({
  watchlistCount = 0,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] =
    useState(() =>
      localStorage.getItem(
        "movieArchiveTheme"
      ) || "dark"
    );

  const [searchTerm, setSearchTerm] =
    useState(() => {
      const params =
        new URLSearchParams(
          window.location.search
        );

      return (
        params.get("query") || ""
      );
    });

  const [mobileSearchOpen, setMobileSearchOpen] =
    useState(false);

  const [user, setUser] =
    useState(() => {
      const savedUser =
        localStorage.getItem(
          "movieArchiveUser"
        );

      return savedUser
        ? JSON.parse(savedUser)
        : null;
    });

  const [userMenuOpen, setUserMenuOpen] =
    useState(false);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem(
      "movieArchiveTheme",
      theme
    );
  }, [theme]);

  useEffect(() => {
    if (
      location.pathname === "/search"
    ) {
      const params =
        new URLSearchParams(
          location.search
        );

      setSearchTerm(
        params.get("query") || ""
      );
    }
  }, [
    location.pathname,
    location.search,
  ]);

  useEffect(() => {
    function updateUser() {
      const savedUser =
        localStorage.getItem(
          "movieArchiveUser"
        );

      setUser(
        savedUser
          ? JSON.parse(savedUser)
          : null
      );
    }

    window.addEventListener(
      "storage",
      updateUser
    );

    return () => {
      window.removeEventListener(
        "storage",
        updateUser
      );
    };
  }, []);

  function toggleTheme() {
    setTheme((current) =>
      current === "dark"
        ? "light"
        : "dark"
    );
  }

  function submitSearch(event) {
    event.preventDefault();

    const query =
      searchTerm.trim();

    if (!query) {
      navigate("/search");
      return;
    }

    navigate(
      `/search?query=${encodeURIComponent(
        query
      )}`
    );

    setMobileSearchOpen(false);
  }

  function handleLogout() {
    localStorage.removeItem(
      "movieArchiveToken"
    );

    localStorage.removeItem(
      "movieArchiveUser"
    );

    setUser(null);
    setUserMenuOpen(false);

    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link
          to="/"
          className="navbar-logo"
        >
          🎬

          <span>
            Movie Archive
          </span>
        </Link>

        <form
          className="navbar-search"
          onSubmit={submitSearch}
        >
          <span>
            🔎
          </span>

          <input
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
            placeholder="Search movies..."
            aria-label="Search movies"
          />
        </form>

        <div className="navbar-actions">
          <Link
            to="/"
            className="navbar-link"
          >
            Home
          </Link>

          <Link
            to="/search"
            className="navbar-link"
          >
            Discover
          </Link>

          <Link
            to="/watchlist"
            className="navbar-link watchlist-link"
          >
            ❤️ Watchlist

            {watchlistCount > 0 && (
              <span className="watchlist-count">
                {watchlistCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="navbar-user">
              <button
                type="button"
                className="user-menu-button"
                onClick={() =>
                  setUserMenuOpen(
                    (current) =>
                      !current
                  )
                }
                aria-label="Open user menu"
                aria-expanded={
                  userMenuOpen
                }
              >
                <span className="user-icon">
                  👤
                </span>

                <span className="user-menu-arrow">
                  {userMenuOpen
                    ? "▲"
                    : "▼"}
                </span>
              </button>

              {userMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <div className="user-dropdown-icon">
                      👤
                    </div>

                    <div className="user-dropdown-details">
                      <strong>
                        {user.name}
                      </strong>

                      <span>
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <div className="user-dropdown-divider"></div>

                  <button
                    type="button"
                    className="logout-button"
                    onClick={handleLogout}
                  >
                    <span>
                      🚪
                    </span>

                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="navbar-link login-link"
            >
              Sign In
            </Link>
          )}

          <button
            type="button"
            className="mobile-search-button"
            onClick={() =>
              setMobileSearchOpen(
                (current) =>
                  !current
              )
            }
            aria-label="Search"
          >
            🔎
          </button>

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={
              theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {theme === "dark"
              ? "☀️"
              : "🌙"}
          </button>
        </div>
      </div>

      {mobileSearchOpen && (
        <form
          className="mobile-navbar-search"
          onSubmit={submitSearch}
        >
          <span>
            🔎
          </span>

          <input
            autoFocus
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
            placeholder="Search movies..."
            aria-label="Search movies"
          />

          <button type="submit">
            Search
          </button>
        </form>
      )}
    </nav>
  );
}

export default Navbar;