import { TabulatorWidget } from "./widget";

function tabulatorFactory(widgetElement: HTMLElement, width: any, height: any) {
  let table: any = null;

  function renderValue(payload: Payload) {
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

    let data: any = null;
    if (payload.options.spreadsheet === true) {
      payload.options.spreadsheetData = payload.data;
    } else {
      data = HTMLWidgets.dataframeToD3(payload.data);
    }

    const widget = new TabulatorWidget(widgetElement, data, payload.options, payload.bindingOptions);
    table = widget.getTable();
  }

  function resize(width: any, height: any) {
    // not implemented yet
  }

  return { renderValue, resize };
}

HTMLWidgets.widget({
  name: "rtabulator",
  type: "output",
  factory: tabulatorFactory,
});
