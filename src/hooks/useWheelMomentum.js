import { useEffect } from "react";

function useWheelMomentum() {
  useEffect(() => {
    let targetScroll = window.scrollY;
    let currentVelocity = 0;
    let animationFrame = null;
    let lastWheelTime = 0;

    function stopAnimation() {
      if (animationFrame !== null) {
        cancelAnimationFrame(
          animationFrame
        );

        animationFrame = null;
      }
    }

    function animate() {
      currentVelocity *= 0.88;

      targetScroll += currentVelocity;

      const maxScroll =
        document.documentElement
          .scrollHeight -
        window.innerHeight;

      targetScroll = Math.max(
        0,
        Math.min(
          targetScroll,
          maxScroll
        )
      );

      window.scrollTo(
        0,
        targetScroll
      );

      if (
        Math.abs(currentVelocity) <
        0.3
      ) {
        animationFrame = null;
        return;
      }

      animationFrame =
        requestAnimationFrame(
          animate
        );
    }

    function handleWheel(event) {
      /*
        Ignore zoom gestures.
      */
      if (event.ctrlKey) {
        return;
      }

      /*
        Ignore horizontal wheel movement.
      */
      if (event.deltaX !== 0) {
        return;
      }

      /*
        Ignore very small movements.
        These are commonly generated
        by trackpads.
      */
      if (
        Math.abs(event.deltaY) < 20
      ) {
        return;
      }

      /*
        Let movie rows keep their own
        horizontal scrolling behavior.
      */
      const movieGrid =
        event.target.closest(
          ".movie-grid"
        );

      if (movieGrid) {
        return;
      }

      const now = performance.now();

      if (
        now - lastWheelTime < 8
      ) {
        return;
      }

      lastWheelTime = now;

      event.preventDefault();

      stopAnimation();

      targetScroll =
        window.scrollY;

      /*
        Add wheel movement to the
        current momentum.
      */
      currentVelocity +=
        event.deltaY * 0.75;

      /*
        Limit maximum scrolling speed.
      */
      currentVelocity = Math.max(
        -90,
        Math.min(
          90,
          currentVelocity
        )
      );

      animationFrame =
        requestAnimationFrame(
          animate
        );
    }

    window.addEventListener(
      "wheel",
      handleWheel,
      {
        passive: false,
      }
    );

    return () => {
      window.removeEventListener(
        "wheel",
        handleWheel
      );

      stopAnimation();
    };
  }, []);
}

export default useWheelMomentum;