import { useEffect, useRef, useState } from "react";

import {
  createFaceLandmarker,
  startCamera,
  getBlendshapeScores,
  detectExpression,
  stopCamera,
  closeFaceLandmarker,
} from "../Utils/utils";

export default function FaceExpressionDetector() {
  const videoRef = useRef(null);

  const faceLandmarkerRef = useRef(null);

  const animationFrameRef = useRef(null);

  const lastVideoTimeRef = useRef(-1);

  const streamRef = useRef(null);

  // ==========================================
  // INTERNAL LIVE EXPRESSION
  // ==========================================

  const [expression, setExpression] = useState("No face");

  // ==========================================
  // UI STATUS
  // ==========================================

  const [status, setStatus] = useState("Starting...");

  // ==========================================
  // BUTTON RESULT
  // ==========================================

  const [detectedResult, setDetectedResult] = useState(null);

  // ==========================================
  // INITIALIZE
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        // --------------------------------
        // OPEN CAMERA
        // --------------------------------

        setStatus("Requesting camera permission...");

        const stream = await startCamera(videoRef.current);

        streamRef.current = stream;

        if (cancelled) {
          stopCamera(stream);
          return;
        }

        setStatus("Camera opened. Loading MediaPipe...");

        // --------------------------------
        // LOAD MEDIAPIPE
        // --------------------------------

        const faceLandmarker = await createFaceLandmarker();

        if (cancelled) {
          closeFaceLandmarker(faceLandmarker);

          return;
        }

        faceLandmarkerRef.current = faceLandmarker;

        setStatus("MediaPipe loaded. Tracking face...");

        // --------------------------------
        // START DETECTION
        // --------------------------------

        detectFace();
      } catch (error) {
        console.error("Initialization error:", error);

        setStatus(`Error: ${error.message}`);
      }
    }

    // ==========================================
    // DETECTION LOOP
    // ==========================================

    function detectFace() {
      if (cancelled) return;

      const video = videoRef.current;

      const faceLandmarker = faceLandmarkerRef.current;

      if (!video || !faceLandmarker) {
        animationFrameRef.current = requestAnimationFrame(detectFace);

        return;
      }

      if (
        video.readyState >= 2 &&
        video.currentTime !== lastVideoTimeRef.current
      ) {
        lastVideoTimeRef.current = video.currentTime;

        try {
          const result = faceLandmarker.detectForVideo(
            video,
            performance.now(),
          );

          processResult(result);
        } catch (error) {
          console.error("Face detection error:", error);
        }
      }

      animationFrameRef.current = requestAnimationFrame(detectFace);
    }

    // ==========================================
    // PROCESS MEDIAPIPE RESULT
    // ==========================================

    function processResult(result) {
      const scoreMap = getBlendshapeScores(result);

      if (!scoreMap) {
        setStatus("Camera working — no face detected");

        setExpression("No face");

        return;
      }

      setStatus("Face detected — tracking");

      const detectedExpression = detectExpression(scoreMap);

      // Internal live value.
      // This is NOT directly displayed.
      setExpression(detectedExpression);
    }

    initialize();

    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {
      cancelled = true;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      stopCamera(streamRef.current);

      closeFaceLandmarker(faceLandmarkerRef.current);

      streamRef.current = null;

      faceLandmarkerRef.current = null;
    };
  }, []);

  // ==========================================
  // BUTTON
  // ==========================================

  function handleDetectExpression() {
    if (expression === "No face") {
      return;
    }

    // Capture the expression ONLY
    // when the button is clicked.
    setDetectedResult(expression);
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      style={{
        padding: "30px",
        textAlign: "center",
      }}
    >
      {/* CAMERA */}

      <div
        style={{
          width: "400px",
          maxWidth: "100%",
          margin: "0 auto",
          background: "#111",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            transform: "scaleX(-1)",
          }}
        />
      </div>

      {/* DETECT BUTTON */}

      <button
        onClick={handleDetectExpression}
        disabled={expression === "No face"}
        style={{
          border: "none",
          borderRadius: "1rem",
          paddingInline: "1rem",
          paddingBlock: "0.7rem",
          marginBlock: "1rem",
          cursor: "pointer",
        }}
      >
        Detect Expression
      </button>

      {/* RESULT */}

      {detectedResult && (
        <div>
          <h2>Detected Expression</h2>

          <h1>{detectedResult}</h1>
        </div>
      )}
    </div>
  );
}
