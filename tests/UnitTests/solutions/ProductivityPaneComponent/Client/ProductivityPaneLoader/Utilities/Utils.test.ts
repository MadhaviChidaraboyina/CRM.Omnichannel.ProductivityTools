import rewire from "rewire";

describe("ProductivityPaneLoader.Utils tests", () => {
  let exportModule: any;

  beforeEach(() => {
    exportModule = rewire("../../../../../../../solutions/ProductivityPaneComponent/Client/ProductivityPaneLoader/Utilities/Utils.js");
  });

  describe("isNullOrUndefined tests", () => {
    it("should return true when obj is null", () => {
      const Utils = exportModule.__get__("ProductivityPaneLoader.Utils");
      const result = Utils.isNullOrUndefined(null);
      expect(result).toBeTruthy();
    });

    it("should return true when obj is undefined", () => {
      const Utils = exportModule.__get__("ProductivityPaneLoader.Utils");
      const result = Utils.isNullOrUndefined(undefined);
      expect(result).toBeTruthy();
    });

    it("should return false when obj is abc or something else", () => {
      const Utils = exportModule.__get__("ProductivityPaneLoader.Utils");
      const result = Utils.isNullOrUndefined("abc");
      expect(result).toBeFalsy();
    });
  });

  describe("isHomeSession tests", () => {
    it("should return true when the sessionId is homeSessionId", () => {
      const homeSessionId = exportModule.__get__("ProductivityPaneLoader.Constants.homeSessionId");
      const isHomeSession = exportModule.__get__("ProductivityPaneLoader.Utils.isHomeSession");
      expect(isHomeSession(homeSessionId)).toBeTruthy();
    });

    it("should return false when the sessionId is not homeSessionId", () => {
      const isHomeSession = exportModule.__get__("ProductivityPaneLoader.Utils.isHomeSession");
      expect(isHomeSession("abc")).toBeFalsy();
    });
  });
});
