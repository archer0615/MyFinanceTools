function bindExport(onExportPng, onExportJson, onExportCsv) {
  const pngButton = document.getElementById("exportPng");
  const jsonButton = document.getElementById("exportJson");
  const csvButton = document.getElementById("exportCsv");
  if (pngButton) pngButton.addEventListener("click", onExportPng);
  if (jsonButton) jsonButton.addEventListener("click", onExportJson);
  if (csvButton) csvButton.addEventListener("click", onExportCsv);
}
