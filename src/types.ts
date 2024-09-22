const Tabulator = (window as any).Tabulator;
const Shiny = (window as any).Shiny;
const HTMLWidgets = (window as any).HTMLWidgets;

type payload = {
  data: any;
  options: any;
  bindingOptions: any;
  calls: any;
  stylesheetText: string;
};

type TabulatorCell = {
  getValue: Function;
  getData: Function;
};

type TabulatorRow = {
  getIndex: Function;
  getData: Function;
};

// type getSelectedRows = () => TabulatorRow[];

type TabulatorTable = {
  [index: string]: Function;
  getData: Function;
  getSelectedRows: Function;
  deleteRow: Function;
  getSheetData: Function;
};
