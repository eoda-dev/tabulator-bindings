import { TabulatorWidget } from "./widget";

function tabulatorFactory(widgetElement, width, height) {
  let table = null;

  function renderValue(payload) {
    console.log(payload);
    if (payload.stylesheetText) {
      document.head.insertAdjacentHTML(
        "beforeend",
        `<style>${payload.stylesheetText}</style>`,
      );
    }

    if (payload.options === null) {
      payload.options = {};
    }

    let data = null;
    if (payload.options.spreadsheet === true) {
      payload.options.spreadsheetData = payload.data;
    } else {
      data = HTMLWidgets.dataframeToD3(payload.data);
    }

    const widget = new TabulatorWidget(widgetElement, data, payload.options);
    table = widget.getTable();
  }

  function resize(width, height) {
    // not implemented yet
  }

  return { renderValue, resize };
}

HTMLWidgets.widget({
  name: "rtabulator",
  type: "output",
  factory: tabulatorFactory,
});
