// TODO: Make datatype and file name params
function createDownloadButton(el, table) {
  const container = document.createElement("div");
  container.id = "download-data";
  container.style.padding = "10px";
  const button = document.createElement("button");
  button.textContent = "Download";
  button.addEventListener("click", () => {
    table.download("csv", "data.csv");
  });
  container.appendChild(button);
  el.before(container);
}

function convertToDataFrame(data) {
  res = {};
  if (data.length === 0) {
    return res;
  }

  keys = Object.keys(data[0]);
  keys.forEach((key) => (res[key] = data.map((item) => item[key])));
  return res;
}

export { convertToDataFrame };
