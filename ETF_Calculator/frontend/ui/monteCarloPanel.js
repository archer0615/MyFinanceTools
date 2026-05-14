function bindMonteCarlo(onRunMonteCarlo) {
  const button = document.getElementById("runMonteCarlo");
  if (!button) return;
  button.addEventListener("click", onRunMonteCarlo);
}
