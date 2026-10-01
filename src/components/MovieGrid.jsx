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

  const touchRef = useRef({
    startX: 0,
    startY: 0,
    moved: false,
    horizontal: false,
  });

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
    DESKTOP MOUSE DRAG
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

    if (!drag.dragging) {
      if (
        Math.abs(deltaX) < 6 &&
        Math.abs(deltaY) < 6
      ) {
        return;
      }

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
    MOBILE TOUCH HANDLING

    We let the browser perform the
    normal horizontal scrolling.

    We only detect whether the finger
    actually moved so a swipe does not
    accidentally activate a movie/card.
  */

  function handleTouchStart(event) {
    const touch = event.touches[0];

    if (!touch) return;

    touchRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      moved: false,
      horizontal: false,
    };
  }

  function handleTouchMove(event) {
    const touch = event.touches[0];

    if (!touch) return;

    const touchState =
      touchRef.current;

    const deltaX =
      touch.clientX -
      touchState.startX;

    const deltaY =
      touch.clientY -
      touchState.startY;

    const distanceX =
      Math.abs(deltaX);

    const distanceY =
      Math.abs(deltaY);

    if (
      distanceX < 8 &&
      distanceY < 8
    ) {
      return;
    }

    touchState.moved = true;

    /*
      Only block clicks for a horizontal
      swipe.

      Vertical movement belongs to the
      normal page scroll.
    */
    if (distanceX > distanceY) {
      touchState.horizontal = true;

      dragRef.current.blockClick =
        true;
    }
  }

  function handleTouchEnd() {
    /*
      Keep blockClick active briefly because
      mobile browsers fire the click event
      immediately after touchend.
    */
    if (
      touchRef.current.horizontal
    ) {
      dragRef.current.blockClick =
        true;

      window.setTimeout(() => {
        dragRef.current.blockClick =
          false;
      }, 150);
    }

    touchRef.current = {
      startX: 0,
      startY: 0,
      moved: false,
      horizontal: false,
    };
  }

  function handleTouchCancel() {
    touchRef.current = {
      startX: 0,
      startY: 0,
      moved: false,
      horizontal: false,
    };

    dragRef.current.blockClick =
      false;
  }

  /*
    Prevent a horizontal swipe from
    triggering the card click.
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
      onPointerDown={
        handlePointerDown
      }
      onPointerMove={
        handlePointerMove
      }
      onPointerUp={
        handlePointerUp
      }
      onPointerCancel={
        handlePointerUp
      }
      onTouchStart={
        handleTouchStart
      }
      onTouchMove={
        handleTouchMove
      }
      onTouchEnd={
        handleTouchEnd
      }
      onTouchCancel={
        handleTouchCancel
      }
      onClickCapture={
        handleClickCapture
      }
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