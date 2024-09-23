import addEventListeners from "./events";
import { convertToDataFrame } from "./utils";

function run_calls(
  tabulatorWidget: TabulatorWidget,
  calls: [string, any][],
) {
  const table = tabulatorWidget.getTable();
  const elementId = tabulatorWidget.getElementId();
  const bindingLang = tabulatorWidget.getBindingLang();
  console.log("binding lang", bindingLang);
  calls.forEach(([method_name, options]) => {
    if (method_name === "getData") {
      const inputName = bindingLang === "r" ? `${elementId}_data:rtabulator.data` : `${elementId}_data`;
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
      const inputName = bindingLang === "r" ? `${elementId}_sheet_data:rtabulator.sheet_data` : `${elementId}_sheet_data`;
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
  _bindingOptions: BindingOptions;

  constructor(container: HTMLElement, data: any, options: any, bindingOptions: BindingOptions) {
    options.data = data;
    this._container = container;
    this._bindingOptions = bindingOptions;
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
      run_calls(this, payload.calls);
    });
  }

  getTable(): TabulatorTable {
    return this._table;
  }

  getElementId(): string {
    return this._container.id;
  }

  getBindingLang(): string {
    return this._bindingOptions.lang;
  }
}

export { run_calls, TabulatorWidget };
