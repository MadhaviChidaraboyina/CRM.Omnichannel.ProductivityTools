import rewire from "rewire";

describe("Microsoft.ProductivityMacros.Internal", () => {
    let exportModule: any;
    let Microsoft: any;
    let ProductivityMacros: any;
    let Internal: any;
    let logFailureSpy: any;
    let logSuccessSpy: any;
 
    beforeAll(() => {
        exportModule = rewire("../../../../../../solutions/ProductivityMacrosComponent/Solution/WebResources/CRMClients/msdyn_ProductivityMacrosComponent_internal_library.js");
        Microsoft = exportModule.__get__("Microsoft");
        ProductivityMacros = Microsoft.ProductivityMacros;
        Internal = ProductivityMacros.Internal;

        logFailureSpy = jest.spyOn(Internal, "logFailure").mockImplementation(() => {});
        logSuccessSpy = jest.spyOn(Internal, "logSuccess").mockImplementation(() => {});
    });

    afterEach(() => {
        logFailureSpy.mockClear();
        logSuccessSpy.mockClear();
    });

    describe("fetchAgentScript", () => {
        it("catchs and rejects on errors calling getFocusedSessionContext", async () => {
            const errorMessage = "error calling getFocusedSessionContext";
            jest.spyOn(Internal, "getFocusedSessionContext").mockImplementation(() => {
                throw errorMessage;
            });
            const actionInputs: any = {
                AgentScriptUniqueName: "agent_script_unique_name"
            }
            const result = Internal.fetchAgentScript(actionInputs);
            await expect(result).rejects.toEqual(
                `Failed to fetch any agent script: ${errorMessage}`);
            expect(logFailureSpy).toBeCalledTimes(1);
        });

        it.each`
            agentScriptUniqueName      | sessionContext
            ${null}              | ${{ templateName: "template name" }}
            ${undefined}         | ${{ templateName: "template name" }}
            ${"agent_script_one"} | ${null}
            ${"agent_script_one"} | ${undefined}
        `("rejects when either agentScriptUniqueName or sessionContext is null or undefined ", 
            async ({ agentScriptUniqueName, sessionContext }) => {
            jest.spyOn(Internal, "getFocusedSessionContext").mockReturnValue(sessionContext);

            const result = Internal.fetchAgentScript(agentScriptUniqueName);
            await expect(result).rejects.toEqual(
                `Either agentScriptUniqueName or sessionContext is null or undefined.`);
        });

        describe("both agentScriptUniqueName and sessionContext are not null or undefined", () => {
            let agentScriptUniqueName: string;
            let templateName: string;
            let entities: any;
            let agentScriptId: string;

            beforeAll(() => {
                agentScriptUniqueName = "agent_script_one";
                templateName = "template one";
                agentScriptId = "0ca168bd-c792-ed11-aad1-002248265396";
                entities = [
                    {
                        msdyn_name: "agent script one",
                        msdyn_productivityagentscriptid: agentScriptId,
                        msdyn_uniquename: "agent_script_one"
                    }
                ];
                jest.spyOn(Internal, "getFocusedSessionContext").mockReturnValue({ templateName });
            });

            it("rejects on empty response or empty response.entities", async () => {
                exportModule.__set__("Xrm", {
                    WebApi: { retrieveMultipleRecords: () => { return null } },
                });
                
                const result = Internal.fetchAgentScript(agentScriptUniqueName);
                await expect(result).rejects.toEqual(
                    `${ProductivityMacros.setFocusToAgentScriptConstants.FETCH_AGENT_SCRIPT_ERROR} based on the session context ${templateName}`);
                expect(logFailureSpy).toBeCalledTimes(1);
            });

            it("rejects on no matching agent scirpt unique name", async () => {
                exportModule.__set__("Xrm", {
                    WebApi: {
                        retrieveMultipleRecords: () => {
                            return { entities };
                        }
                    },
                });
                
                const wrongAgentScript = "agent_script_two";
                const result = Internal.fetchAgentScript(wrongAgentScript);
                await expect(result).rejects.toEqual(
                    `${ProductivityMacros.setFocusToAgentScriptConstants.FETCH_AGENT_SCRIPT_ERROR} based on the name ${wrongAgentScript}`);
                expect(logFailureSpy).toBeCalled();
            });

            it("fetches the agent script successfully", async () => {
                exportModule.__set__("Xrm", {
                    WebApi: {
                        retrieveMultipleRecords: () => {
                            return { entities };
                        }
                    },
                });
               
                const result = Internal.fetchAgentScript(agentScriptUniqueName);
                await expect(result).resolves.toEqual(agentScriptId);
                expect(logSuccessSpy).toBeCalledTimes(1);
                expect(logFailureSpy).not.toBeCalled();
            });
        });
    });

    describe("setFocusToAgentScript", () => {
        const actionName = "Set_focus_to_an_agent_script";
        it.each`
            actionInputs
            ${null}
            ${undefined}
        `("rejects on $actionInputs actionInputs", async ({ actionInputs }) => {
            const result = Internal.setFocusToAgentScript(actionName, actionInputs);
            await expect(result).rejects.toEqual(ProductivityMacros.setFocusToAgentScriptConstants.INVALID_ACTION_INPUTS);
            const errorData = {
                "errorMsg": ProductivityMacros.setFocusToAgentScriptConstants.INVALID_ACTION_INPUTS,
                "errorType": Internal.errorTypes.InvalidParams,
                "reportTime": new Date().toUTCString(),
                "sourceFunc": ProductivityMacros.setFocusToAgentScriptConstants.setFocusToAgentScript
            }
            expect(logFailureSpy).toBeCalledWith(ProductivityMacros.setFocusToAgentScriptConstants.setFocusToAgentScript, errorData);
            expect(logSuccessSpy).toBeCalledTimes(0);
        });

        describe("actionInputs is not null or undefined", () => {
            let fetchAgentScriptSpy: any;
            let actionInputs: any;

            beforeAll(() => {
                fetchAgentScriptSpy = jest.spyOn(Internal, "fetchAgentScript");
                actionInputs = { AgentScriptUniqueName: "agent_script_one"};
            });

            afterEach(() => {
                fetchAgentScriptSpy.mockClear();
            })

            it("rejects on errors calling featchAgentScript", async () => {
                fetchAgentScriptSpy.mockRejectedValue("error");
                const result = Internal.setFocusToAgentScript(actionName, actionInputs);
                await expect(result).rejects.toEqual(`${ProductivityMacros.setFocusToAgentScriptConstants.setFocusToAgentScript}: error`);
                expect(logFailureSpy).toBeCalled();
            });

            it("rejects on null or undefined agentScriptId", async () => {
                fetchAgentScriptSpy.mockResolvedValue(null);
                const result = Internal.setFocusToAgentScript(actionName, actionInputs);
                await expect(result).rejects.toEqual(ProductivityMacros.setFocusToAgentScriptConstants.AGENT_SCRIPT_NOT_FOUND);
                expect(logFailureSpy).toBeCalled();
            });

            it("resolve with valid agentScriptId", async () => {
                const createPublishTopicSpy = jest.spyOn(Internal, "createPublishTopic");
                const postMessageSpy = jest.fn();
                const closeSpy = jest.fn();
                createPublishTopicSpy.mockImplementation(() => {
                    return {
                        postMessage: postMessageSpy,
                        close: closeSpy
                    }
                });

                const agentScriptId = "0ca168bd-c792-ed11-aad1-002248265396";
                fetchAgentScriptSpy.mockResolvedValue(agentScriptId);
                let outputResponse: any = {};
                let agentScriptParams: any = {};
                agentScriptParams[actionName + ".AgentScriptId"] = agentScriptId;
                outputResponse[ProductivityMacros.Constants.OutputResult] = agentScriptParams;
                const result = Internal.setFocusToAgentScript(actionName, actionInputs);
                await expect(result).resolves.toEqual(outputResponse);
                expect(logSuccessSpy).toBeCalledWith(
                    ProductivityMacros.setFocusToAgentScriptConstants.setFocusToAgentScript,
                    agentScriptId,
                    outputResponse
                );
                expect(postMessageSpy).toBeCalled();
                expect(closeSpy).toBeCalled();
            });
        });
    });
});
