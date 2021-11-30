import { shallowMount } from "@vue/test-utils";
import { nextTick } from "@vue/runtime-core";
import Home from "@/views/Home";
import AppDropdown from "@/components/elements/AppDropdown";
import AppButton from "@/components/elements/AppButton";
import AppField from "@/components/elements/AppField";
import generateTableItems from "@/utils/genericTableItems";

describe("Home", () => {
  let wrapper;
  let $router;

  const DATA_TEST_CONDITION_FILTER = "condition-filter";
  const DATA_TEST_COLUMN_FILTER = "column-filter";
  const DATA_TEST_RESET_BUTTON = "reset-button";
  const DATA_TEST_INPUT_FILTER = "input-filter";
  const DATA_TABLE_CELL = "[data-test=cell]";
  const DATA_EMPTY = "[data-test=empty]";

  const createComponent = ({ stubs } = {}) => {
    const $route = {
      query: {},
    };

    $router = {
      replace: jest.fn(),
    };
    wrapper = shallowMount(Home, {
      global: { mocks: { $route, $router }, stubs },
    });
  };

  const findComponentByDataAttr = (component, dataTest) =>
    wrapper
      .findAllComponents(component)
      .find((c) => c.attributes("data-test") === dataTest);

  const findCellsByDataId = (id) =>
    wrapper
      .findAll(DATA_TABLE_CELL)
      .filter((cell) => cell.attributes("data-id") === id);

  const openInputFilter = async ({
    conditionFilter = "equal",
    columnFilter = "title",
  } = {}) => {
    const columnDropdown = findComponentByDataAttr(
      AppDropdown,
      DATA_TEST_COLUMN_FILTER
    );
    await columnDropdown.vm.$emit("update:modelValue", {
      filterProperty: columnFilter,
      value: "Название",
    });

    const conditionDropdown = findComponentByDataAttr(
      AppDropdown,
      DATA_TEST_CONDITION_FILTER
    );

    await conditionDropdown.vm.$emit("update:modelValue", {
      filterName: conditionFilter,
      value: "Равно",
    });
  };

  it("condition filter is showed", async () => {
    createComponent();

    let conditionDropdown = findComponentByDataAttr(
      AppDropdown,
      DATA_TEST_CONDITION_FILTER
    );
    const columnDropdown = findComponentByDataAttr(
      AppDropdown,
      DATA_TEST_COLUMN_FILTER
    );

    // check before showed
    expect(conditionDropdown).toBe(undefined);
    await columnDropdown.vm.$emit("update:modelValue", {
      filterProperty: "title",
      value: "Название",
    });
    conditionDropdown = findComponentByDataAttr(
      AppDropdown,
      DATA_TEST_CONDITION_FILTER
    );

    expect(conditionDropdown.exists()).toBe(true);
  });

  it("reset button is showed", async () => {
    createComponent();

    let resetButton = findComponentByDataAttr(
      AppButton,
      DATA_TEST_RESET_BUTTON
    );
    const columnDropdown = findComponentByDataAttr(
      AppDropdown,
      DATA_TEST_COLUMN_FILTER
    );

    // check before showed
    expect(resetButton).toBe(undefined);

    await columnDropdown.vm.$emit("update:modelValue", {
      filterProperty: "title",
      value: "Название",
    });

    resetButton = findComponentByDataAttr(AppButton, DATA_TEST_RESET_BUTTON);
    expect(resetButton.exists()).toBe(true);
  });

  it("input filter is showed", async () => {
    createComponent();

    const columnDropdown = findComponentByDataAttr(
      AppDropdown,
      DATA_TEST_COLUMN_FILTER
    );
    let input = findComponentByDataAttr(AppField, DATA_TEST_INPUT_FILTER);
    // check before showed
    expect(input).toBe(undefined);

    await columnDropdown.vm.$emit("update:modelValue", {
      filterProperty: "title",
      value: "Название",
    });

    input = findComponentByDataAttr(AppField, DATA_TEST_INPUT_FILTER);
    // check before showed
    expect(input).toBe(undefined);

    const conditionDropdown = findComponentByDataAttr(
      AppDropdown,
      DATA_TEST_CONDITION_FILTER
    );

    await conditionDropdown.vm.$emit("update:modelValue", {
      filterName: "equal",
      value: "Равно",
    });
    input = findComponentByDataAttr(AppField, DATA_TEST_INPUT_FILTER);

    expect(input.exists()).toBe(true);
  });

  it("reset page on first when entered input value", async () => {
    createComponent();

    await openInputFilter();

    const input = findComponentByDataAttr(AppField, DATA_TEST_INPUT_FILTER);
    await input.vm.$emit("update:modelValue", "value");

    await nextTick();

    expect($router.replace).toHaveBeenCalledWith({ query: { page: 1 } });
  });

  it("filter reset", async () => {
    createComponent();
    const COLUMN_PLACEHOLDER = "Колонка";

    await openInputFilter();

    let input = findComponentByDataAttr(AppField, DATA_TEST_INPUT_FILTER);
    await input.vm.$emit("update:modelValue", "value");

    const resetButton = findComponentByDataAttr(
      AppButton,
      DATA_TEST_RESET_BUTTON
    );
    await resetButton.vm.$emit("clickButton");

    const columnDropdown = findComponentByDataAttr(
      AppDropdown,
      DATA_TEST_COLUMN_FILTER
    );
    const conditionDropdown = findComponentByDataAttr(
      AppDropdown,
      DATA_TEST_CONDITION_FILTER
    );
    input = findComponentByDataAttr(AppField, DATA_TEST_INPUT_FILTER);

    expect(columnDropdown.attributes("placeholder")).toBe(COLUMN_PLACEHOLDER);
    expect(conditionDropdown).toBe(undefined);
    expect(input).toBe(undefined);
  });

  it("empty text showed when !items.length", () => {
    createComponent({ stubs: { AppTable: false } });
  });

  it("filter equal", async () => {
    createComponent({ stubs: { AppTable: false } });
    const tableItems = generateTableItems(10);

    await openInputFilter({ conditionFilter: "equal", columnFilter: "title" });

    const input = findComponentByDataAttr(AppField, DATA_TEST_INPUT_FILTER);
    await input.vm.$emit("update:modelValue", tableItems[0].cells.title.value);

    const isEqual = findCellsByDataId("title").every(
      (cell) => cell.text() === tableItems[0].cells.title.value
    );

    expect(isEqual).toBe(true);
  });

  it("filter contain", async () => {
    createComponent({ stubs: { AppTable: false } });
    const tableItems = generateTableItems(10);

    await openInputFilter({
      conditionFilter: "contain",
      columnFilter: "title",
    });

    const input = findComponentByDataAttr(AppField, DATA_TEST_INPUT_FILTER);
    await input.vm.$emit("update:modelValue", tableItems[0].cells.title.value);

    const isContain = findCellsByDataId("title").every((cell) =>
      cell.text().includes(tableItems[0].cells.title.value)
    );

    expect(isContain).toBe(true);
  });

  it("filter larger", async () => {
    createComponent({ stubs: { AppTable: false } });
    const LARGER_VALUE = "10";

    await openInputFilter({
      conditionFilter: "larger",
      columnFilter: "distance",
    });

    const input = findComponentByDataAttr(AppField, DATA_TEST_INPUT_FILTER);
    await input.vm.$emit("update:modelValue", LARGER_VALUE);

    const isLarge = findCellsByDataId("distance").every(
      (cell) => cell.text() > LARGER_VALUE
    );

    expect(isLarge).toBe(true);
  });

  it("filter less", async () => {
    createComponent({ stubs: { AppTable: false } });
    const LESS_VALUE = "2";

    await openInputFilter({
      conditionFilter: "less",
      columnFilter: "distance",
    });

    const input = findComponentByDataAttr(AppField, DATA_TEST_INPUT_FILTER);
    await input.vm.$emit("update:modelValue", LESS_VALUE);

    const isLess = findCellsByDataId("distance").every(
      (cell) => cell.text() < LESS_VALUE
    );

    expect(isLess).toBe(true);
  });

  it("empty text is showed", async () => {
    createComponent();
    const VALUE = "non-existent meaning";

    await openInputFilter({
      conditionFilter: "equal",
      columnFilter: "title",
    });

    const input = findComponentByDataAttr(AppField, DATA_TEST_INPUT_FILTER);
    let empty = wrapper.find(DATA_EMPTY);

    //check before showed
    expect(empty.exists()).toBe(false);
    await input.vm.$emit("update:modelValue", VALUE);

    empty = wrapper.find(DATA_EMPTY);

    expect(empty.exists()).toBe(true);
  });
});
