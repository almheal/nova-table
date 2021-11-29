import { shallowMount } from "@vue/test-utils";
import AppDropdown from "@/components/elements/AppDropdown";

describe("App dropdown", () => {
  let wrapper;

  const DATA_PLACEHOLDER = "[data-test=placeholder]";
  const DATA_LIST = "[data-test=list]";
  const DATA_ITEM = "[data-test=item]";

  const createComponent = (props) => {
    wrapper = shallowMount(AppDropdown, { props });
  };

  const findItemByContent = (content) =>
    wrapper.findAll(DATA_ITEM).find((item) => item.text() === content);

  it("placeholder is rendered", async () => {
    const PLACEHOLDER = "test-placeholder";
    createComponent({
      placeholder: PLACEHOLDER,
    });

    const placeholder = wrapper.find(DATA_PLACEHOLDER);
    await placeholder.trigger("click");

    expect(placeholder.html()).toContain(PLACEHOLDER);
  });

  it.each`
    title                                  | items                   | expectedResult
    ${"contain is-open class"}             | ${["test-1", "test-2"]} | ${true}
    ${"does not contain an is-open class"} | ${[]}                   | ${false}
  `("wrapper $title", async ({ items, expectedResult }) => {
    createComponent({ items });

    const placeholder = wrapper.find(DATA_PLACEHOLDER);
    await placeholder.trigger("click");

    expect(wrapper.classes("is-open")).toBe(expectedResult);
  });

  it.each`
    title           | items                   | expectedResult
    ${"showed"}     | ${["test-1", "test-2"]} | ${true}
    ${"not showed"} | ${[]}                   | ${false}
  `("dropdown list $title", async ({ items, expectedResult }) => {
    createComponent({
      items,
    });

    const placeholder = wrapper.find(DATA_PLACEHOLDER);
    await placeholder.trigger("click");
    const list = wrapper.find(DATA_LIST);

    expect(list.exists()).toBe(expectedResult);
  });

  it("only modelValue rendered in placeholder", () => {
    const MODEL_VALUE = "test-modelValue";
    const PLACEHOLDER = "test-placeholder";
    createComponent({
      modelValue: MODEL_VALUE,
      placeholder: PLACEHOLDER,
    });

    const placeholder = wrapper.find(DATA_PLACEHOLDER);
    //checking that placeholder contains only modelValue
    expect(placeholder.html()).not.toContain(PLACEHOLDER);
    expect(placeholder.html()).toContain(MODEL_VALUE);
  });

  it("rendered items contain toShow function content", async () => {
    const items = [{ title: "title-1" }, { title: "title-2" }];
    createComponent({ items, toShow: (item) => item.title });

    const placeholder = wrapper.find(DATA_PLACEHOLDER);
    await placeholder.trigger("click");
    const item = findItemByContent(items[0].title);

    expect(item?.exists()).toBe(true);
  });

  it("rendered items not contain modelValue item", async () => {
    const items = [{ title: "title-1" }, { title: "title-2" }];
    createComponent({ items, modelValue: items[0] });

    const placeholder = wrapper.find(DATA_PLACEHOLDER);
    await placeholder.trigger("click");
    const item = findItemByContent(items[0].title);

    expect(item).toBe(undefined);
  });

  it("event update:modelValue emitted with value", async () => {
    const items = ["title-1", "title-2"];
    createComponent({ items });

    const placeholder = wrapper.find(DATA_PLACEHOLDER);
    await placeholder.trigger("click");
    const item = findItemByContent(items[0]);
    await item.trigger("click");

    expect(wrapper.emitted("update:modelValue")).toEqual(
      expect.arrayContaining([[items[0]]])
    );
  });

  it("after select item list is hidden", async () => {
    const items = ["title-1", "title-2"];
    createComponent({ items });

    const placeholder = wrapper.find(DATA_PLACEHOLDER);
    await placeholder.trigger("click");
    const item = findItemByContent(items[0]);
    await item.trigger("click");
    const list = wrapper.find(DATA_LIST);

    expect(list.exists()).toBe(false);
  });

  it("after select item wrapper not contain is-open class", async () => {
    const items = ["title-1", "title-2"];
    createComponent({ items });

    const placeholder = wrapper.find(DATA_PLACEHOLDER);
    await placeholder.trigger("click");
    const item = findItemByContent(items[0]);
    await item.trigger("click");

    expect(wrapper.classes("is-open")).toBe(false);
  });
});
