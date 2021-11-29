import { shallowMount } from "@vue/test-utils";
import AppField from "@/components/elements/AppField";

describe("App field", () => {
  let wrapper;

  const DATA_INPUT = "[data-test=input]";

  const createComponent = (props) => {
    wrapper = shallowMount(AppField, { props });
  };

  it("event update:modelValue emitted with entered value", async () => {
    const TEST_VALUE = "test-value";
    createComponent();

    const input = wrapper.find(DATA_INPUT);
    await input.setValue(TEST_VALUE);

    expect(wrapper.emitted("update:modelValue")).toEqual(
      expect.arrayContaining([[TEST_VALUE]])
    );
  });

  it("input contain placeholder", () => {
    const PLACEHOLDER = "test-placeholder";
    createComponent({ placeholder: PLACEHOLDER });

    const input = wrapper.find(DATA_INPUT);

    expect(input.attributes("placeholder")).toBe(PLACEHOLDER);
  });

  it("input contain modelValue", () => {
    const MODEL_VALUE = "test-modelValue";
    createComponent({ modelValue: MODEL_VALUE });

    const input = wrapper.find(DATA_INPUT);

    expect(input.element.value).toBe(MODEL_VALUE);
  });
});
