import { shallowMount } from "@vue/test-utils";
import AppTable from "@/components/elements/AppTable";

describe("App table", () => {
  let wrapper;

  const DATA_COLUMN = "[data-test=column]";
  const DATA_ROW = "[data-test=row]";
  const DATA_CELL = "[data-test=cell]";

  const DEFAULT_ROWS = [
    {
      cells: {
        date: { value: "1" },
      },
    },
    { cells: { date: { value: "2" } } },
    { cells: { date: { value: "3" } } },
  ];

  const DEFAULT_COLUMNS = [{ value: "value-1" }, { value: "value-2" }];

  const createComponent = (props) =>
    (wrapper = shallowMount(AppTable, { props }));

  const findItemByContent = (dataTest, content) =>
    wrapper.findAll(dataTest).find((item) => item.text() === content);

  it("columns in rendered", () => {
    createComponent({ columns: DEFAULT_COLUMNS });

    const columns = wrapper.findAll(DATA_COLUMN);

    expect(columns).toHaveLength(DEFAULT_COLUMNS.length);
  });

  it("rows is rendered", () => {
    createComponent({ rows: DEFAULT_ROWS });

    const rows = wrapper.findAll(DATA_ROW);

    expect(rows).toHaveLength(DEFAULT_ROWS.length);
  });

  it("cells is rendered", () => {
    createComponent({ rows: DEFAULT_ROWS });

    const cells = wrapper.findAll(DATA_CELL);

    expect(cells).toHaveLength(cells.length);
  });

  it("columns contain value", () => {
    createComponent({ columns: DEFAULT_COLUMNS });

    const column = findItemByContent(DATA_COLUMN, DEFAULT_COLUMNS[0].value);

    expect(column?.exists()).toBe(true);
  });

  it("cells contain value", () => {
    createComponent({ rows: DEFAULT_ROWS });

    const cell = findItemByContent(DATA_CELL, DEFAULT_ROWS[0].cells.date.value);

    expect(cell?.exists()).toBe(true);
  });
});
