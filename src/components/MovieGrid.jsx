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
    lastX: 0,
    lastTime: 0,
    velocity: 0,
  });

  const momentumRef = useRef({
    animationFrame: null,
    velocity: 0,
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
    Stop any running momentum animation.
  */

  function stopMomentum() {
    if (
      momentumRef.current
        .animationFrame !== null
    ) {
      cancelAnimationFrame(
        momentumRef.current
          .animationFrame
      );

      momentumRef.current.animationFrame =
        null;
    }

    momentumRef.current.velocity = 0;
  }

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

    stopMomentum();

    const now = performance.now();

    dragRef.current = {
      pressed: true,
      dragging: false,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: grid.scrollLeft,
      blockClick: false,
      lastX: event.clientX,
      lastTime: now,
      velocity: 0,
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

    const now = performance.now();
    const elapsed =
      now - drag.lastTime;

    if (elapsed > 0) {
      /*
        Mouse movement velocity.

        Positive velocity means the pointer
        moved right, so the content moves left.
      */
      drag.velocity =
        (event.clientX - drag.lastX) /
        elapsed;
    }

    drag.lastX = event.clientX;
    drag.lastTime = now;

    grid.scrollLeft =
      drag.scrollLeft - deltaX;
  }

  /*
    Continue scrolling after the mouse
    is released.
  */

  function startMomentum() {
    const grid = gridRef.current;

    if (!grid) return;

    let velocity =
      dragRef.current.velocity;

    /*
      Convert pointer velocity into
      scroll velocity.

      The multiplier controls how far
      the row continues after release.
    */
    velocity *= 25;

    /*
      Prevent tiny accidental movement.
    */
    if (Math.abs(velocity) < 0.3) {
      return;
    }

    /*
      Limit maximum momentum speed.
    */
    velocity = Math.max(
      -35,
      Math.min(35, velocity)
    );

    momentumRef.current.velocity =
      velocity;

    function animate() {
      const currentVelocity =
        momentumRef.current.velocity;

      if (
        Math.abs(currentVelocity) < 0.15
      ) {
        momentumRef.current.animationFrame =
          null;

        momentumRef.current.velocity =
          0;

        grid.classList.remove(
          "movie-grid-momentum"
        );

        return;
      }

      grid.scrollLeft -=
        currentVelocity;

      /*
        Friction.

        Smaller value = longer glide.
        Larger value = stops faster.
      */
      momentumRef.current.velocity *=
        0.95;

      momentumRef.current.animationFrame =
        requestAnimationFrame(
          animate
        );
    }

    grid.classList.add(
      "movie-grid-momentum"
    );

    momentumRef.current.animationFrame =
      requestAnimationFrame(
        animate
      );
  }

  function handlePointerUp(event) {
    const drag = dragRef.current;
    const grid = gridRef.current;

    if (
      event.pointerType !== "mouse"
    ) {
      return;
    }

    const wasDragging =
      drag.dragging;

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

    /*
      Start momentum only after an
      actual horizontal drag.
    */
    if (wasDragging) {
      startMomentum();
    }
  }

  /*
    Prevent a desktop horizontal drag
    from triggering a card click.
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

  /*
    Clean up animation when the component
    is removed.
  */

  useEffect(() => {
    return () => {
      stopMomentum();
    };
  }, []);

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