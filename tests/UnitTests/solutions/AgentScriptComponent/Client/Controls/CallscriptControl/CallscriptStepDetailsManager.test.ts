import rewire from "rewire";

describe("CallscriptStepDetailsManager", () => {
    let exportModule: any;
    let MscrmControls: any;
    let Callscript: any;
    let CallscriptStepDetailsManager: any;
    let context: any;
    let stateManager: any;
    let logger: any;
    let logErrorFn: any;
    let logSuccessFn: any;
    let macro: any;
    let updateCurrentCallScriptByIDFn: any;
    let requestRenderFn: any;

    beforeAll(() => {
        exportModule = rewire("../../../../../../../solutions/AgentscriptComponent/Client/Controls/CallscriptControl/CallscriptControl.js");
        MscrmControls = exportModule.__get__("MscrmControls");
        Callscript = MscrmControls.Callscript;
        logErrorFn = jest.fn();
        logSuccessFn = jest.fn();
        logger = { logError: logErrorFn, logSuccess: logSuccessFn }
        exportModule.__set__("Microsoft", {
            AppRuntime: { 
                Internal: { subscribeTopic: jest.fn() },
            }
        });
        updateCurrentCallScriptByIDFn = jest.fn();
        stateManager = { updateCurrentCallScriptByID: updateCurrentCallScriptByIDFn };
        requestRenderFn = jest.fn();
        context = { utils: { requestRender: requestRenderFn } };
        CallscriptStepDetailsManager = new Callscript.CallscriptStepDetailsManager(context, stateManager, logger, macro);
    });

    describe("repathAgentScript", () => {
        it("logs an error on empty payload", () => {
            CallscriptStepDetailsManager.repathAgentScript(null);
            expect(logErrorFn).toBeCalledWith(
                Callscript.TelemetryComponents.CallscriptStepListitemManager,
                Callscript.RepathAgentScriptLoggerConstants.repathAgentScript,
                Callscript.RepathAgentScriptLoggerConstants.INVALID_PAYLOAD,
                {"eventParamList": []}
            );
        });

        describe("payload is not empty, null or undefined", () => {
            let payload: any;
            let agentScriptId: string;
            let actionType: any;
            let actionInputs: any;
            let macroAction: any;
            let textAction: any;
            let setAgentScriptSpy: any;

            beforeEach(() => {
                agentScriptId = "0ca168bd-c792-ed11-aad1-002248265396";
                macroAction = Callscript.CallscriptActionType.MacroAction;
                textAction = Callscript.CallscriptActionType.TextAction;
                actionType = macroAction;
                actionInputs = { AgentScriptUniqueName: "agent_script_one" };
                payload = { data: { agentScriptId, actionType, actionInputs } };
                setAgentScriptSpy = jest.spyOn(CallscriptStepDetailsManager, "setAgentScript");
            });

            afterEach(() => {
                setAgentScriptSpy.mockClear();
            })

            it.each`
                actionType     | agentScriptId
                ${macroAction} | ${null}
                ${macroAction} | ${undefined}
                ${macroAction} | ${""}
                ${macroAction} | ${"123"}
                ${textAction}  | ${agentScriptId}
            `("logs an error on invalid macro action: $actionType or agent script Id: $agentScriptId ", ({ actionType, agentScriptId }) => {
                payload = { data: { agentScriptId, actionType, actionInputs } };
                const eventParams = new Callscript.EventParameters();
                eventParams.addParameter(Callscript.RepathAgentScriptLoggerConstants.agentScriptId, agentScriptId);
                eventParams.addParameter(Callscript.RepathAgentScriptLoggerConstants.actionType, actionType);
                eventParams.addParameter(Callscript.RepathAgentScriptLoggerConstants.actionInputs, JSON.stringify(actionInputs));

                CallscriptStepDetailsManager.repathAgentScript(payload);
                expect(logErrorFn).toBeCalledWith(
                    Callscript.TelemetryComponents.CallscriptStepListitemManager,
                    Callscript.RepathAgentScriptLoggerConstants.repathAgentScript,
                    Callscript.RepathAgentScriptLoggerConstants.INVALID_MACRO_ACTION_OR_AGENTSCRIPT_ID,
                    eventParams
                );
            });

            it("logs an error on calling other methods", () => {
                const error = new Error();
                setAgentScriptSpy.mockImplementationOnce(() => { throw error });

                const eventParams = new Callscript.EventParameters();
                eventParams.addParameter(Callscript.RepathAgentScriptLoggerConstants.agentScriptId, agentScriptId);
                eventParams.addParameter(Callscript.RepathAgentScriptLoggerConstants.actionType, actionType);
                eventParams.addParameter(Callscript.RepathAgentScriptLoggerConstants.actionInputs, JSON.stringify(actionInputs));

                CallscriptStepDetailsManager.repathAgentScript(payload);
                expect(logErrorFn).toBeCalledWith(
                    Callscript.TelemetryComponents.CallscriptStepListitemManager,
                    Callscript.RepathAgentScriptLoggerConstants.repathAgentScript,
                    error,
                    eventParams
                );
            });

            it("sets focus to agent script successfully", () => {
                payload = { data: { agentScriptId, actionType, actionInputs } };
                setAgentScriptSpy.mockImplementation(() => {});
                CallscriptStepDetailsManager.repathAgentScript(payload);
                const eventParams = new Callscript.EventParameters();
                eventParams.addParameter(Callscript.RepathAgentScriptLoggerConstants.agentScriptId, agentScriptId);
                eventParams.addParameter(Callscript.RepathAgentScriptLoggerConstants.actionType, actionType);
                eventParams.addParameter(Callscript.RepathAgentScriptLoggerConstants.actionInputs, JSON.stringify(actionInputs));

                expect(logSuccessFn).toBeCalledWith(
                    Callscript.TelemetryComponents.CallscriptStepListitemManager,
                    Callscript.RepathAgentScriptLoggerConstants.repathAgentScript,
                    eventParams
                );
            });
        });
    });
});
