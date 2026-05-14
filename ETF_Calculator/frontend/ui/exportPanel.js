function bindExport(onExportPng) {
  const button = document.getElementById("exportPng");
  if (!button) return;
  button.addEventListener("click", onExportPng);
}
