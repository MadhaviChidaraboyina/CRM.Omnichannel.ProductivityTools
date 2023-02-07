import rewire from "rewire";

describe("AgentscriptFormScript", () => {
  let exportModule: any;
  let AgentScriptPackage: any;
  let AgentscriptFormScript: any;

  beforeAll(() => {
    exportModule = rewire(
      "../../../../../../solutions/AgentscriptComponent/Solution/WebResources/msdyn_AgentscriptComponentFormScript.js"
    );
    AgentScriptPackage = exportModule.__get__("AgentScriptPackage");
    AgentscriptFormScript = AgentScriptPackage.AgentscriptFormScript;
  });

  describe("onFormLoad", () => {
    let executionContext;
    let value = "";
    let languageOptions = [];
    const setValueSpy = jest.fn();

    beforeEach(() => {
      value = null;
      languageOptions = [];
    });

    beforeAll(() => {
      executionContext = {
        getFormContext: () => {
          return {
            getAttribute: () => {
              return {
                getValue: () => value,
                setValue: setValueSpy,
              };
            },
            getControl: () => {
              return {
                getOptions: () => languageOptions,
              };
            },
          };
        },
      };
    });

    it("should not set language option value when language options are null", () => {
      languageOptions = null;

      AgentscriptFormScript.Instance.onFormLoad(executionContext);

      expect(setValueSpy).toBeCalledTimes(0);
    });

    it("should not set language option value when language options are empty", () => {
      languageOptions = [];

      AgentscriptFormScript.Instance.onFormLoad(executionContext);

      expect(setValueSpy).toBeCalledTimes(0);
    });

    it("should not set value when value already exists", () => {
      value = "defaultLanguage";

      AgentscriptFormScript.Instance.onFormLoad(executionContext);

      expect(setValueSpy).toHaveBeenCalledTimes(0);
    });

    it("should set 1st index language value option", () => {
      const language = "language";
      languageOptions = [{ value: "" }, { value: language }];

      AgentscriptFormScript.Instance.onFormLoad(executionContext);

      expect(setValueSpy).toHaveBeenCalledWith(language);
    });
  });

  describe("isNullOrUndefined", () => {
    it.each`
      value        | expectedResult
      ${"string"}  | ${false}
      ${""}        | ${false}
      ${" "}       | ${false}
      ${"   "}     | ${false}
      ${123}       | ${false}
      ${[]}        | ${false}
      ${false}     | ${false}
      ${true}      | ${false}
      ${{}}        | ${false}
      ${null}      | ${true}
      ${undefined} | ${true}
    `("$value should return $expectedResult", ({ value, expectedResult }) => {
      expect(AgentscriptFormScript.Instance.isNullOrUndefined(value)).toBe(
        expectedResult
      );
    });
  });
});
