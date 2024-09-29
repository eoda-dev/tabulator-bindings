const Tabulator = (window as any).Tabulator;
const Shiny = (window as any).Shiny;
const HTMLWidgets = (window as any).HTMLWidgets;

type BindingOptions = {
  lang: string;
};

type Payload = {
  data: any;
  options: any;
  bindingOptions: BindingOptions;
  calls: [string, any][];
  stylesheetText: string;
};

type TabulatorCell = {
  getData: Function;
  getValue: Function;
};

type TabulatorRow = {
  getData: Function;
  getIndex: Function;
};

// type getSelectedRows = () => TabulatorRow[];

type TabulatorTable = {
  [index: string]: Function;
  deleteRow: Function;
  getData: Function;
  getSelectedRows: Function;
  getSheetData: Function;
  on: Function;
};
