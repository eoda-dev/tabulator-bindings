"use strict";
(() => {
  // built/utils.js
  function convertToDataFrame(data) {
    const res = {};
    if (data.length === 0) {
      return res;
    }
    const keys = Object.keys(data[0]);
    keys.forEach((key) => res[key] = data.map((item) => item[key]));
    return res;
  }

  // built/widget.js
  function run_calls(el, table, calls) {
    calls.forEach(([method_name, options]) => {
      if (method_name === "getData") {
        const inputName = `${el.id}_data:rtabulator.data`;
        console.log("custom call", inputName);
        Shiny.setInputValue(inputName, { data: convertToDataFrame(table.getData()) }, { priority: "event" });
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
      if (method_name === "getSheetData") {
        const inputName = `${el.id}_sheet_data:rtabulator.sheet_data`;
        console.log("custom call", inputName);
        Shiny.setInputValue(inputName, { data: table.getSheetData() }, { priority: "event" });
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
    getId() {
      return this._container.id;
    }
  };

  // built/index-r.js
  function tabulatorFactory(widgetElement, width, height) {
    let table = null;
    function renderValue(payload) {
      console.log(payload);
      if (payload.stylesheetText) {
        document.head.insertAdjacentHTML("beforeend", `<style>${payload.stylesheetText}</style>`);
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
    function resize(width2, height2) {
    }
    return { renderValue, resize };
  }
  HTMLWidgets.widget({
    name: "rtabulator",
    type: "output",
    factory: tabulatorFactory
  });
})();
