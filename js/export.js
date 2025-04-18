
function exportToCSV(data, filename) {
  let csv = data.map(row => row.join(",")).join("\n");
  let blob = new Blob([csv], { type: "text/csv" });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}
