importScripts("core/monteCarlo.js");

self.onmessage = (event) => {
  const { input, iterations, seed } = event.data;
  runMonteCarloBatched(input, iterations, seed || 42, {
    batchSize: 100,
    onProgress(progress) {
      self.postMessage({ type: "progress", progress });
    }
  }).then((result) => {
    self.postMessage({ type: "complete", result });
  });
};
