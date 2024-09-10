(() => {
  // src/events.js
  function addEventListeners(table, el) {
    table.on("rowClick", function(e, row) {
      const inputName = `${el.id}_row_clicked`;
      console.log(inputName, row.getData());
      Shiny.onInputChange(inputName, row.getData());
    });
    table.on("rowClick", (e, row) => {
      const inputName = `${el.id}_rows_selected`;
      const data = table.getSelectedRows().map((row2) => row2.getData());
      console.log(inputName, data);
      Shiny.onInputChange(inputName, data);
    });
    table.on("cellEdited", function(cell) {
      const inputName = `${el.id}_row_edited`;
      console.log(inputName, cell.getData());
      Shiny.onInputChange(inputName, cell.getData());
    });
    table.on("dataFiltered", function(filters, rows) {
      const inputName = `${el.id}_data_filtered`;
      const data = rows.map((row) => row.getData());
      console.log(inputName, data);
      Shiny.onInputChange(inputName, data);
    });
  }

  // src/widget.js
  function run_calls(el, table, calls) {
    calls.forEach(([method_name, options]) => {
      if (method_name === "getData") {
        console.log("custom call");
        Shiny.onInputChange(`${el.id}_data`, table.getData());
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
      console.log(method_name, options);
      table[method_name](...options);
    });
  }
  var TabulatorWidget = class {
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
      const messageHandlerName = `tabulator-${this._container.id}`;
      Shiny.addCustomMessageHandler(messageHandlerName, (payload) => {
        console.log(payload);
        run_calls(this._container, this._table, payload.calls);
      });
    }
    getTable() {
      return this._table;
    }
  };

  // src/index.js
  var TabulatorOutputBinding = class extends Shiny.OutputBinding {
    find(scope) {
      return scope.find(".shiny-tabulator-output");
    }
    renderValue(el, payload) {
      console.log("payload", payload);
      const widget = new TabulatorWidget(el, payload.data, payload.options);
      const table = widget.getTable();
      table.on("tableBuilt", function() {
        if (payload.options.columnUpdates != null) {
          console.log("column updates", payload.options.columnUpdates);
        }
      });
    }
  };
  Shiny.outputBindings.register(
    new TabulatorOutputBinding(),
    "shiny-tabulator-output"
  );
})();
