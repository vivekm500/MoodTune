import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

const WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm";

// =====================================================
// CREATE MEDIAPIPE FACE LANDMARKER
// =====================================================

export async function createFaceLandmarker() {
  const vision = await FilesetResolver.forVisionTasks(WASM_URL);

  const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: MODEL_URL,
    },

    runningMode: "VIDEO",

    numFaces: 1,

    outputFaceBlendshapes: true,

    minFaceDetectionConfidence: 0.5,
    minFacePresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  return faceLandmarker;
}

// =====================================================
// START CAMERA
// =====================================================

export async function startCamera(videoElement) {
  if (!videoElement) {
    throw new Error("Video element not found");
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: 640,
      height: 480,
      facingMode: "user",
    },
    audio: false,
  });

  videoElement.srcObject = stream;

  await videoElement.play();

  return stream;
}

// =====================================================
// GET BLENDSHAPE SCORES
// =====================================================

export function getBlendshapeScores(result) {
  if (!result.faceBlendshapes || result.faceBlendshapes.length === 0) {
    return null;
  }

  const blendshapes = result.faceBlendshapes[0].categories;

  const scoreMap = {};

  for (const item of blendshapes) {
    scoreMap[item.categoryName] = item.score;
  }

  return scoreMap;
}

// =====================================================
// EXPRESSION CLASSIFIER
// =====================================================

export function detectExpression(s) {
  // =================================
  // RAW SIGNALS
  // =================================

  const smile = ((s.mouthSmileLeft || 0) + (s.mouthSmileRight || 0)) / 2;

  const frown = ((s.mouthFrownLeft || 0) + (s.mouthFrownRight || 0)) / 2;

  const browInnerUp = s.browInnerUp || 0;

  const browDown = ((s.browDownLeft || 0) + (s.browDownRight || 0)) / 2;

  const eyeWide = ((s.eyeWideLeft || 0) + (s.eyeWideRight || 0)) / 2;

  const eyeSquint = ((s.eyeSquintLeft || 0) + (s.eyeSquintRight || 0)) / 2;

  const jawOpen = s.jawOpen || 0;

  // =================================
  // HAPPY
  // =================================

  const happyScore = smile;

  // =================================
  // SURPRISED
  // =================================

  let surprisedScore = 0;

  if (eyeWide > 0.25) {
    surprisedScore += 0.45;
  }

  if (jawOpen > 0.2) {
    surprisedScore += 0.35;
  }

  if (browInnerUp > 0.2) {
    surprisedScore += 0.2;
  }

  // =================================
  // SAD
  // =================================

  let sadScore = 0;

  if (browInnerUp > 0.2) {
    sadScore += 0.45;
  }

  if (frown > 0.05) {
    sadScore += 0.35;
  }

  if (eyeWide < 0.15) {
    sadScore += 0.1;
  }

  if (jawOpen < 0.15) {
    sadScore += 0.1;
  }

  // =================================
  // ANGRY
  // =================================

  let angryScore = 0;

  // Brow down is the primary signal
  if (browDown > 0.25) {
    angryScore += 0.6;
  }

  // Squint is supporting evidence only
  if (browDown > 0.2 && eyeSquint > 0.3) {
    angryScore += 0.2;
  }

  // Frown is supporting evidence
  if (browDown > 0.2 && frown > 0.05) {
    angryScore += 0.15;
  }

  // Prevent natural eye squint
  // from producing anger
  if (browDown < 0.15) {
    angryScore = 0;
  }

  // =================================
  // STRONG PRIORITY RULES
  // =================================

  // Surprise should win over sadness
  if (eyeWide > 0.3 && jawOpen > 0.25) {
    return "😮 Surprised";
  }

  // Smile should win over everything
  if (smile > 0.45) {
    return "😊 Happy";
  }

  // =================================
  // FIND STRONGEST EXPRESSION
  // =================================

  const expressionScores = {
    "😮 Surprised": surprisedScore,
    "😢 Sad": sadScore,
    "😠 Angry": angryScore,
    "😊 Happy": happyScore,
  };

  const [expression, score] = Object.entries(expressionScores).sort(
    (a, b) => b[1] - a[1],
  )[0];

  // =================================
  // MINIMUM CONFIDENCE
  // =================================

  if (score < 0.4) {
    return "😐 Calm";
  }

  return expression;
}

// =====================================================
// STOP CAMERA
// =====================================================

export function stopCamera(stream) {
  if (!stream) return;

  stream.getTracks().forEach((track) => {
    track.stop();
  });
}

// =====================================================
// CLOSE MEDIAPIPE
// =====================================================

export function closeFaceLandmarker(faceLandmarker) {
  if (!faceLandmarker) return;

  faceLandmarker.close();
}
