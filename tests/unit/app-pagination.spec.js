import { shallowMount } from "@vue/test-utils";
import AppPagination from "@/components/elements/AppPagination";

describe("App pagination", () => {
  let wrapper;
  let $router;

  const DATA_PREVIOUS = "[data-test=previous]";
  const DATA_NEXT = "[data-test=next]";
  const DATA_BUTTON = "[data-test=button]";

  const DEFAULT_LIMIT = 10;

  const createComponent = (props, { route } = {}) => {
    $router = {
      replace: jest.fn(),
    };

    const $route = {
      query: {},
      ...route,
    };

    wrapper = shallowMount(AppPagination, {
      props,
      global: { mocks: { $router, $route } },
    });
  };

  const findButtonByContent = (content) =>
    wrapper
      .findAll(DATA_BUTTON)
      .find((button) => button.text() === String(content));

  const findButtonsByClass = (buttonClass) =>
    wrapper
      .findAll(DATA_BUTTON)
      .filter((button) => button.classes(buttonClass));

  it.each`
    title            | activePage | expectedResult
    ${"contain"}     | ${1}       | ${true}
    ${"not contain"} | ${2}       | ${false}
  `(
    "previous button $title is-disabled class",
    ({ activePage, expectedResult }) => {
      createComponent({
        activePage,
      });

      const previousButton = wrapper.find(DATA_PREVIOUS);

      expect(previousButton.classes("is-disabled")).toBe(expectedResult);
    }
  );

  it.each`
    title                                          | activePage
    ${"previous button change page on -1"}         | ${"2"}
    ${"disabled previous button not changed page"} | ${"1"}
  `("$title", async ({ activePage }) => {
    createComponent({ itemsLength: 20, activePage });

    const previousButton = wrapper.find(DATA_PREVIOUS);
    await previousButton.trigger("click");

    if (activePage === "1") {
      expect(wrapper.emitted()).not.toHaveProperty("changePage");
    } else {
      expect(wrapper.emitted("changePage")).toEqual(
        expect.arrayContaining([[activePage - 1]])
      );
    }
  });

  it.each`
    title                                      | activePage
    ${"next button change page on +1"}         | ${"1"}
    ${"disabled next button not changed page"} | ${"2"}
  `("$title", async ({ activePage }) => {
    createComponent({ itemsLength: 20, activePage });

    const nextButton = wrapper.find(DATA_NEXT);
    await nextButton.trigger("click");

    if (activePage === "2") {
      expect(wrapper.emitted()).not.toHaveProperty("changePage");
    } else {
      expect(wrapper.emitted("changePage")).toEqual(
        expect.arrayContaining([[Number(activePage) + 1]])
      );
    }
  });

  it.each`
    title            | itemsLength | activePage | expectedResult
    ${"contain"}     | ${10}       | ${1}       | ${true}
    ${"not contain"} | ${20}       | ${1}       | ${false}
  `(
    "next button $title is-disabled class",
    ({ itemsLength, activePage, expectedResult }) => {
      createComponent({ itemsLength, activePage });

      const nextButton = wrapper.find(DATA_NEXT);

      expect(nextButton.classes("is-disabled")).toBe(expectedResult);
    }
  );

  it("default limit is 10", () => {
    const ITEMS_LENGTH = 20;
    createComponent({
      itemsLength: ITEMS_LENGTH,
    });

    const buttons = wrapper.findAll(DATA_BUTTON);

    expect(buttons).toHaveLength(ITEMS_LENGTH / DEFAULT_LIMIT);
  });

  it("when click on active page, changePage not emitted", async () => {
    const ACTIVE_PAGE = 1;
    createComponent({ itemsLength: 10, activePage: ACTIVE_PAGE });

    const button = findButtonByContent(ACTIVE_PAGE);
    await button.trigger("click");

    expect(wrapper.emitted()).not.toHaveProperty("changePage");
  });

  it("event changePage emitted with value", async () => {
    const NEXT_PAGE = 2;
    createComponent({ itemsLength: 20, activePage: 1 });

    const button = findButtonByContent(NEXT_PAGE);
    await button.trigger("click");

    expect(wrapper.emitted("changePage")).toEqual(
      expect.arrayContaining([[NEXT_PAGE]])
    );
  });

  it.each`
    title                                                | savePage | expectedResult
    ${"should not be called when !savePage"}             | ${false} | ${false}
    ${"should be called with active page when savePage"} | ${true}  | ${true}
  `("router replace query $title", async ({ savePage, expectedResult }) => {
    const NEXT_PAGE = 2;
    createComponent({ itemsLength: 20, activePage: 1, savePage });

    const button = findButtonByContent(NEXT_PAGE);
    await button.trigger("click");

    if (expectedResult) {
      expect($router.replace).toHaveBeenCalledWith({
        query: { page: NEXT_PAGE },
      });
    } else {
      expect($router.replace).not.toHaveBeenCalled();
    }
  });

  it("button contain is-active class when number equal active page", () => {
    const ACTIVE_PAGE = "2";
    createComponent({ itemsLength: 20, activePage: ACTIVE_PAGE });

    const buttons = findButtonsByClass("is-active");

    // check that only one button have is-active class
    expect(buttons).toHaveLength(1);
    expect(buttons[0].text()).toBe(ACTIVE_PAGE);
  });
});
