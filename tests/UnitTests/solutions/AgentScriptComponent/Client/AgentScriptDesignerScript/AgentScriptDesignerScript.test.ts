import rewire from "rewire";

describe("AgentScriptDesignerScript", () => {
  let exportModule: any;
  let AgentScriptDesignerScript: any;

  beforeAll(() => {
    exportModule = rewire(
      "../../../../../../solutions/AgentscriptComponent/Solution/WebResources/AgentScriptDesigner/msdyn_AgentscriptDesginer_internal_libarary.js"
    );
    AgentScriptDesignerScript = exportModule.__get__("Microsoft.AgentScript.Utility");
  });

  describe("agentScriptDialogOnLoadHandler", () => {
    let executionContext;
    let designerControl;
    let recordId;
    const appUrl = "https://crm.dynamics.com";
    const expectedBaseURl = "https://crm.dynamics.com/WebResources/AgentScriptDesigner/msdyn_agentScriptDesigner.html";

    beforeEach(() => {
      recordId = null;
    })

    beforeAll(() => {
      exportModule.__set__("Xrm", {
        Utility: {
          getGlobalContext: () => {
            return {
              getCurrentAppUrl: () => appUrl
            }
          }
        },
      });

      designerControl = {
        setSrc: jest.fn()
      };

      executionContext = {
        getFormContext: () => {
          return {
            getControl: () => designerControl,
            data: {
              attributes: {
                getByName: () => {
                  return {
                    getValue: () => recordId
                  }
                }
              }
            }
          };
        },
      };
    });

    it("should not pass record ID in URL if record ID is null", () => {
      recordId = null;

      AgentScriptDesignerScript.agentScriptDialogOnLoadHandler(executionContext);

      expect(designerControl.setSrc).toHaveBeenCalledWith(expectedBaseURl);
    });

    it("should pass record ID in URL", () => {
      recordId = "case-id-0";

      AgentScriptDesignerScript.agentScriptDialogOnLoadHandler(executionContext);

      expect(designerControl.setSrc).toHaveBeenCalledWith(`${expectedBaseURl}?id=${recordId}`);
    });
  });
});
