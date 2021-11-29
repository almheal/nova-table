import { shallowMount } from "@vue/test-utils";
import AppButton from "@/components/elements/AppButton";

describe("App button", () => {
  let wrapper;
  const DATA_BUTTON = "[data-test=button]";

  const createComponent = ({ slots } = {}) => {
    wrapper = shallowMount(AppButton, {
      slots,
    });
  };

  it("event clickButton emitted", async () => {
    createComponent();

    const button = wrapper.find(DATA_BUTTON);
    await button.trigger("click");

    expect(wrapper.emitted()).toHaveProperty("clickButton");
  });

  it("slot is rendered", () => {
    const SLOT_TEXT = "Default slot is rendered";
    createComponent({ slots: { default: SLOT_TEXT } });

    const button = wrapper.find(DATA_BUTTON);

    expect(button.html()).toContain(SLOT_TEXT);
  });
});
