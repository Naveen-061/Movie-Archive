import {
  useEffect,
  useRef,
  useState,
} from "react";

import MovieCard from "./MovieCard.jsx";
import "./MovieGrid.css";

function MovieGrid({
  movies = [],
  watchlist = [],
  onToggleWatchlist,
  showMore = false,
  onMore,
  loadingMore = false,
}) {
  const gridRef = useRef(null);

  const [cardHeight, setCardHeight] =
    useState(null);

  const dragRef = useRef({
    pressed: false,
    dragging: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    blockClick: false,
  });

  /*
    Match More Movies height to the
    first normal movie card.
  */
  useEffect(() => {
    const grid = gridRef.current;

    if (!grid) return;

    const firstCard =
      grid.querySelector(".movie-card");

    if (!firstCard) return;

    function updateHeight() {
      const height =
        firstCard.getBoundingClientRect()
          .height;

      if (height > 0) {
        setCardHeight(height);
      }
    }

    updateHeight();

    const observer = new ResizeObserver(
      updateHeight
    );

    observer.observe(firstCard);

    return () => {
      observer.disconnect();
    };
  }, [movies]);

  /*
    MOUSE DRAG

    Do not capture the pointer when the
    mouse is pressed.

    Only capture it AFTER the user
    actually starts dragging.
  */

  function handlePointerDown(event) {
    if (
      event.pointerType !== "mouse" ||
      event.button !== 0
    ) {
      return;
    }

    const grid = gridRef.current;

    if (!grid) return;

    dragRef.current = {
      pressed: true,
      dragging: false,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: grid.scrollLeft,
      blockClick: false,
    };
  }

  function handlePointerMove(event) {
    const drag = dragRef.current;
    const grid = gridRef.current;

    if (
      !grid ||
      !drag.pressed ||
      event.pointerType !== "mouse"
    ) {
      return;
    }

    const deltaX =
      event.clientX - drag.startX;

    const deltaY =
      event.clientY - drag.startY;

    /*
      Ignore tiny mouse movements.
      These should remain normal clicks.
    */
    if (!drag.dragging) {
      if (
        Math.abs(deltaX) < 6 &&
        Math.abs(deltaY) < 6
      ) {
        return;
      }

      /*
        Only start dragging when the
        movement is primarily horizontal.
      */
      if (
        Math.abs(deltaX) <=
        Math.abs(deltaY)
      ) {
        drag.pressed = false;
        return;
      }

      drag.dragging = true;
      drag.blockClick = true;

      grid.classList.add(
        "movie-grid-dragging"
      );

      /*
        Capture only after detecting
        an actual horizontal drag.
      */
      grid.setPointerCapture?.(
        event.pointerId
      );
    }

    grid.scrollLeft =
      drag.scrollLeft - deltaX;
  }

  function handlePointerUp(event) {
    const drag = dragRef.current;
    const grid = gridRef.current;

    if (
      event.pointerType !== "mouse"
    ) {
      return;
    }

    drag.pressed = false;
    drag.dragging = false;

    grid?.classList.remove(
      "movie-grid-dragging"
    );

    if (
      grid?.hasPointerCapture?.(
        event.pointerId
      )
    ) {
      grid.releasePointerCapture(
        event.pointerId
      );
    }
  }

  /*
    Block clicks only after an
    actual horizontal drag.

    Normal clicks are untouched.
  */
  function handleClickCapture(event) {
    if (
      dragRef.current.blockClick
    ) {
      event.preventDefault();
      event.stopPropagation();

      dragRef.current.blockClick =
        false;
    }
  }

  const validMovies =
    Array.isArray(movies)
      ? movies.filter(
          (movie) =>
            movie &&
            movie.id !== undefined &&
            movie.id !== null
        )
      : [];

  return (
    <div
      ref={gridRef}
      className="movie-grid"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClickCapture={handleClickCapture}
    >
      {validMovies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          watchlist={watchlist}
          onToggleWatchlist={
            onToggleWatchlist
          }
        />
      ))}

      {showMore && (
        <button
          type="button"
          className="more-movies-card"
          style={
            cardHeight
              ? {
                  height: `${cardHeight}px`,
                }
              : undefined
          }
          onClick={onMore}
          disabled={loadingMore}
        >
          <div className="more-movies-glow">
            <span>
              {loadingMore
                ? "⏳"
                : "+"}
            </span>
          </div>

          <span className="more-movies-title">
            {loadingMore
              ? "Loading..."
              : "More Movies"}
          </span>

          <span className="more-movies-subtitle">
            {loadingMore
              ? "Getting more movies..."
              : "Explore the next collection"}
          </span>

          {!loadingMore && (
            <span className="more-movies-arrow">
              →
            </span>
          )}
        </button>
      )}
    </div>
  );
}

export default MovieGrid;