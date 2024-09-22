import { convertToDataFrame } from "./utils";

export default function addEventListeners(
  table: TabulatorTable,
  el: HTMLElement,
) {
  // console.log("table", table);
  table.on("rowClick", function (e: Event, row: TabulatorRow) {
    const inputName = `${el.id}_row_clicked`;
    console.log(inputName, row.getData());
    Shiny.onInputChange(inputName, row.getData());
  });

  table.on("rowClick", (e: Event, row: TabulatorRow) => {
    const inputName = `${el.id}_rows_selected:rtabulator.data`;
    const data = table.getSelectedRows().map((row: any) => row.getData());
    console.log(inputName, data);
    Shiny.onInputChange(inputName, { data: convertToDataFrame(data) });
  });

  table.on("cellEdited", function (cell: TabulatorCell) {
    const inputName = `${el.id}_cell_edited`;
    console.log(inputName, cell.getData());
    // cell.getData() returns complete row data,
    // cell.getValue() returns cell value only
    Shiny.onInputChange(inputName, cell.getData());
  });

  table.on("dataFiltered", function (filters: any, rows: TabulatorRow[]) {
    const inputName = `${el.id}_data_filtered:rtabulator.data`;
    const data = rows.map((row) => row.getData());
    console.log(inputName, data);
    Shiny.onInputChange(inputName, { data: convertToDataFrame(data) });
  });
}
