import addEventListeners from "./events";
import { convertToDataFrame } from "./utils";

function run_calls(el, table, calls) {
  calls.forEach(([method_name, options]) => {
    if (method_name === "getData") {
      const inputName = `${el.id}_get_data`;
      console.log("custom call", inputName);
      Shiny.setInputValue(
        inputName,
        { data: convertToDataFrame(table.getData()) },
        { priority: "event" },
      );
      return;
    }

    if (method_name === "deleteSelectedRows") {
      console.log("custom call");
      const rows = table.getSelectedRows();
      rows.forEach((row) => {
        console.log(row.getIndex());
        table.deleteRow(row.getIndex());
      });
      return;
    }

    if (method_name === "getSpreadsheetData") {
      const inputName = `${el.id}_spreadsheet_data`;
      console.log("custom call", inputName);
      Shiny.setInputValue(
        inputName,
        { data: table.getSheetData() },
        { priority: "event" },
      );
      return;
    }

    console.log(method_name, options);
    table[method_name](...options);
  });
}

class TabulatorWidget {
  constructor(container, data, options) {
    options.data = data;
    this._container = container;
    console.log("columns", options.columns);
    if (data !== null && options.columns == null) {
      options.autoColumns = true;
    }

    if (options.spreadsheet && options.spreadsheetData == null) {
      options.spreadsheetData = [];
    }

    this._table = new Tabulator(this._container, options);
    if (typeof Shiny === "object") {
      addEventListeners(this._table, this._container);
      this._addShinyMessageHandler();
    }
  }

  _addShinyMessageHandler() {
    // This must be inside table.on("tableBuilt")
    const messageHandlerName = `tabulator-${this._container.id}`;
    Shiny.addCustomMessageHandler(messageHandlerName, (payload) => {
      console.log(payload);
      run_calls(this._container, this._table, payload.calls);
    });
  }

  getTable() {
    return this._table;
  }
}

export { run_calls, TabulatorWidget };
