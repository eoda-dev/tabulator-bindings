import addEventListeners from "./events";
import { convertToDataFrame } from "./utils";

function run_calls(
  el: HTMLElement,
  table: TabulatorTable,
  calls: [string, any][],
) {
  calls.forEach(([method_name, options]) => {
    if (method_name === "getData") {
      // TODO: This input name is only usable in R,
      // we need to pass meta data to the table
      const inputName = `${el.id}_data:rtabulator.data`;
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
      const rows: TabulatorRow[] = table.getSelectedRows();
      rows.forEach((row) => {
        console.log(row.getIndex());
        table.deleteRow(row.getIndex());
      });
      return;
    }

    if (method_name === "getSheetData") {
      // TODO: This input name is only usable in R, see above
      const inputName = `${el.id}_sheet_data:rtabulator.sheet_data`;
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
  _container: HTMLElement;
  _table: TabulatorTable;

  constructor(container: HTMLElement, data: any, options: any) {
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
    Shiny.addCustomMessageHandler(messageHandlerName, (payload: Payload) => {
      console.log(payload);
      run_calls(this._container, this._table, payload.calls);
    });
  }

  getTable(): TabulatorTable {
    return this._table;
  }

  getId(): string {
    return this._container.id;
  }
}

export { run_calls, TabulatorWidget };
