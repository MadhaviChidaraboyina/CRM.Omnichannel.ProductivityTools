import * as SharedDefines from "./sharedDefines";
import * as Utils from "./sharedUtils";
import * as OAuth from "./oAuthService";
import * as HostService from "./hostService";


(window as any).requirejs.config({
	context: 'designer',
	baseUrl: (window as any)._DesignerBlobCdnBase + 'flowcontrol/DesignerBlob/'
});


function getMonacoLocale(editorLocaleName) {
	// Mapping of the languages Monaco editor supports. Default to english for non-supported languages.
	let monacoLocalesMap = {
		"de": "de",
		"es": "es",
		"fr": "fr",
		"it": "it",
		"ja": "ja",
		"ko": "ko",
		"ru": "ru",
		"zh-hans": "zh-cn",
        "zh-hant": "zh-tw",
        "nb": "no",
        "zh": "zh-hans",
	};

	return monacoLocalesMap[editorLocaleName] || "en";
}

let LOCALE = Utils.Utils.getUrlParam("locale", "en");
let monacoLocale = getMonacoLocale(LOCALE);
LOCALE = monacoLocale === "en" ? LOCALE : monacoLocale;
document.getElementsByTagName("html")[0].setAttribute("lang", LOCALE);
let designerSupportedLocales = [
	"bg", "ca", "cs", "da", "de", "el", "es", "et", "eu", "fi", "fr", "gl", "hi", "hr", "hu", "id", "it", "ja", "ja-ploc-jp", "kk", "ko", "lt", "lv", "ms", "nl", "no", "pl", "pt-br", "pt-pt", "qps-ploc", "ro", "ru", "sk", "sl", "sr-cyrl-rs", "sr-latn-rs", "sv", "th", "tr", "uk", "vi", "zh-hans", "zh-hant"
];
function getLocalizedResources() {
	if (LOCALE === "en" || !LOCALE || (designerSupportedLocales.indexOf(LOCALE) < 0)) {
		return "LogicApps/core/scripts/resources.logicapps.min"
	} else {
		return "LogicApps/core/scripts/loc_gen/" + LOCALE + "/resources.logicapps.min"
	}
}

let FeaturesToEnable = {
	ALLOW_EMPTY_DEFINITION: true,
	ADVANCED_PARAMETER: true,
	AUTO_CASTING_IN_PARAMETER_FIELD_TIP: true,
	COLLAPSE_ALL_CARDS: true,
	CONCURRENCY: false,
	DEBOUNCE_EMIT_CHANGE: true,
	DISABLE_AUTO_FOCUS_PARAMETERS: true,
	DISABLE_TOKEN_PICKER_COMPACT_MODE: true,
	FX_TOKEN: false,
	FX_TOKEN_FOR_CONDITION: false,
	GATEWAY_FOR_CONNECTION: true,
	HTML_EDITOR: false,
	INITIALIZE_DYNAMIC_CONTENT_ASYNC: true,
	NEW_CONDITION_RULES_BUILDER: true,
	NEW_RECOMMENDATION_CARD_WITH_MODULES: true,
	NEW_RECOMMENDATION_CARD_WITH_FOR_YOU: false,
	NEW_SCHEMA_EDITOR: true,
	RAW_MODE: false,
	SHOW_CONNECTION_NAME: true,
	SHOW_INSERT_ACTION_BUTTON: true,
	SHOW_PARENT_OBJECT_FOR_OUTPUTS: true,
	SHOW_SOFT_LANDING_TIPS: true,
	SHOW_TOKENS_FOR_FOREACH: true,
	SHOW_TRIGGER_RECURRENCE: false,
	SHOW_VARIABLE_ACTIONS: true,
	STATIC_RESULT: true,
	SUPPORT_NESTED_FOREACH_UI: true,
	SUPPORT_PAN_AND_ZOOM: false,
	SUPPORT_PEEK: true,
	TOKEN_COPY_PASTE: true,
	USE_CONNECTION_CONFIGURATION_SERVICE: false,
	USE_DICTIONARY_EDITOR: true,
	USE_EDITOR_INPUT: true,
	USE_NEW_EXPRESSION_PARSER: false,
	USE_TEXT_EDITOR: true
};

function startInit() {
	(window as any).publicPath = (window as any)._DesignerBlobCdnBase + "flowcontrol/DesignerBlob/" + "LogicApps/core/scripts/";
	var req = (window as any).requirejs.config({
		context: 'designer',
		paths: {
			'fuse': 'node_modules/fuse/fuse',
			'react': 'node_modules/react/react.production.min',
			'react-dom': 'node_modules/react-dom/react-dom.production.min',
			'immutable': 'node_modules/immutable/immutable.min',
			'localforage': 'node_modules/localforage/localforage.min',
			"draft-js": 'node_modules/draft-js/dist/Draft.min',
			'resources': getLocalizedResources(),
			'SwaggerParser': 'LogicApps/swagger/swagger-parser.min',
			'office-ui-fabric-react': 'node_modules/office-ui-fabric-react/dist/office-ui-fabric-react.min',
			'@microsoft/load-themed-styles': 'node_modules/@microsoft/load-themed-styles/index',
			'@uifabric/utilities/lib': 'node_modules/@uifabric/utilities/lib-amd',
			'@uifabric/styling/lib': 'node_modules/@uifabric/styling/lib-amd',
			'@uifabric/icons/lib': 'node_modules/@uifabric/icons/lib-amd',
			'@uifabric/merge-styles/lib': 'node_modules/@uifabric/merge-styles/lib-amd',
			'prop-types': 'node_modules/prop-types/prop-types.min',
			'tslib': 'node_modules/tslib/tslib',
			'cds-control-expression': 'LogicApps/expr',
			'Reselect': 'node_modules/reselect/reselect',
			're-reselect': 'node_modules/re-reselect/index',
            /*'draft-js-export-html': 'node_modules/draft-js-export-html/draft-js-export-html.min',
            'draft-js-import-html': 'node_modules/draft-js-import-html/draft-js-import-html.min',*/
			'react-draft-wysiwyg': 'node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.min',
			'core/main': 'LogicApps/core/scripts/core.monitor'/*,
                    'oauth': './OAuthService',
                    'WorkflowUtility': './WorkflowUtility'*/
		},
		map: {
			'*': {
				'office-ui-fabric-react/lib/common/DirectionalHint': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/ActivityItem': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Autofill': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Breadcrumb': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Button': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Calendar': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Callout': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Check': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Checkbox': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/ChoiceGroup': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Coachmark': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Color': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/ColorPicker': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/ComboBox': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/CommandBar': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/ContextualMenu': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/DatePicker': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/DetailsList': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Dialog': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/DocumentCard': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Dropdown': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Fabric': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Facepile': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/FloatingPicker': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/FocusTrapZone': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/FocusZone': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Grid': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/GroupedList': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/HoverCard': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Icon': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Icons': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Image': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Keytip': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/KeytipData': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/KeytipLayer': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Label': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Layer': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Link': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/List': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/MarqueeSelection': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/MessageBar': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Modal': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Nav': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/OverflowSet': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Overlay': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Panel': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Persona': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/PersonaCoin': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Pickers': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Pivot': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Popup': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/ProgressIndicator': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Rating': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/ResizeGroup': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/ScrollablePane': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/SearchBox': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/SelectableOption': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/SelectedItemsList': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Selection': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Shimmer': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Slider': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Spinner': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Sticky': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Styling': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/SwatchColorPicker': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/TeachingBubble': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/TextField': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Text': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/ThemeGenerator': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Toggle': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Tooltip': 'office-ui-fabric-react',
				'office-ui-fabric-react/lib/Utilities': 'office-ui-fabric-react',
				'reselect': 'Reselect'
			}
		},
		shim: {
			'office-ui-fabric-react': {
				deps: ['prop-types', 'react', 'react-dom', 'tslib'],
				exports: 'Fabric'
			}
		}
	});
	initializeMonitor(req);
}
function getAuthenticationToken() {
	return "abc";
}
function initializeMonitor(req) {
	req(["react", "react-dom", "immutable"], function (React, ReactDOM, Immutable) {

		(window as any).Immutable = Immutable;
		(window as any).React = React;
		(window as any).ReactDOM = ReactDOM;

		req(["draft-js"], function (Draft) {
			(window as any).Draft = Draft;

			//TODO: use localized resources here - getLocalizedResources() is currently throwing runtime error - webpack unable to resolve dependency
			req(["SwaggerParser", "resources", "core/main"], function (SwaggerParser, Resources, DesignerCore) {
				//require.ensure(["requirejs/require.js"],
				//function (require) {                
				DesignerCore.requireScriptForEditor("node_modules/monaco-editor/min/vs");
				let monacoLocale = getMonacoLocale(LOCALE);
				var monitor, flowConfigurationOptions;
				var element = document.getElementById("monitorcontainer");

				let rpc = new DesignerCore.rpc.Rpc({
					signature: SharedDefines.Constants.MONITOR_CONTROL_SIGNATURE,
					targetOrigin: decodeURIComponent(Utils.Utils.getUrlParam("base", "*")),
					rpcMessageHandler: new DesignerCore.rpc.WindowPostMessageRpcHandler({
						targetWindow: window.parent,
						messageSerializer: function (message) {
							return Utils.Utils.serialize(message, SharedDefines.Constants.MONITOR_CONTROL_SIGNATURE, SharedDefines.Constants.MWRAPPER_CONTROL_SIGNATURE);
						},
						messageDeserializer: function (message) {
							return Utils.Utils.deserialize(message, SharedDefines.Constants.MWRAPPER_CONTROL_SIGNATURE, SharedDefines.Constants.MONITOR_CONTROL_SIGNATURE);
						}
					})
				});
				rpc.register(SharedDefines.DesignerMessages.InitializeMonitor, function (options) {
					//console.log("Start initialize");
					let monitorOptions: SharedDefines.IMonitorOptions = JSON.parse(options);
					let operationManager: HostService.OperationManager = new HostService.OperationManager(monitorOptions);
					let builtInTypeServiceFactory = function (analytics, schemaVersion) {
						return new HostService.BuiltInTypeService(monitorOptions, analytics);
					};
					let recommendationServiceFactory = function (analytics, schemaVersion) {
						let builtInTypeServiceFactory = function (analytics, schemaVersion) {
							return new DesignerCore.LogicAppsBuiltInTypeService(schemaVersion, monitorOptions);
						};
						return new HostService.SmartRecommendationImpl(
							{ builtInTypeService: builtInTypeServiceFactory(analytics, schemaVersion) },
							monitorOptions,
							operationManager,
							analytics
						);
					}

					let urlService = new DesignerCore.LogicAppsUrlService({
						baseUrl: monitorOptions.BaseUrl,
						config: {
							apiOperationsPath: "/providers/Microsoft.Web/locations/" + monitorOptions.location + "/apiOperations",
							connectionsPath: "/providers/Microsoft.Web/connections",
							connectionProvidersPath: "/providers/Microsoft.Web/locations/" + options.location + "/managedApis",
							gatewaysPath: "/providers/Microsoft.Web/connectionGateways"
						},
						subscriptionId: monitorOptions.subscriptionId,
						resourceGroup: monitorOptions.resourceGroup,
						location: monitorOptions.location,
						//integrationAccountId: designerOptions.integrationAccountId
					});
					let oauthService = new OAuth.OAuthPopupService();
					let connectionServiceFactory = function (analytics) {
						return new DesignerCore.LogicAppsConnectionService({
							getAccessToken: getAuthenticationToken,
							baseUrl: monitorOptions.BaseUrl,
							apiVersionForConnection: monitorOptions.ApiVersion,
							apiVersionForCustomConnector: monitorOptions.ApiVersion,
							apiVersionForGateways: monitorOptions.ApiVersion,
							apiVersionForIseManagedConnector: monitorOptions.ApiVersion,
							apiVersionForSharedManagedConnector: monitorOptions.ApiVersion,
							oauthService: oauthService,
							analytics: analytics,
							locale: LOCALE,
							urlService: urlService,
							batchApiVersion: monitorOptions.ApiVersion
						});
					};
					let operationManifestServiceFactory = function (analytics) {
						return new HostService.OperationManifestServiceImpl(monitorOptions, operationManager, analytics);
					};

					//let operationManifestServiceFactory = new DesignerCore.LogicAppsOperationManifestService();

					let runInstanceServiceFactory = function (analytics) {
						return new HostService.runInstanceServiceImpl({
							analytics: analytics,
							apiVersion: options.emaApiVersion,
							baseUrl: options.baseUrl,
							getAccessToken: getAuthenticationToken(),
							locale: "en"
						}, monitorOptions.executionStatusJSON);
					};

					var runServiceFactory = function (analytics) {
						return new HostService.runServiceImpl({
							analytics: analytics,
							apiVersion: options.emaApiVersion,
							baseUrl: options.baseUrl,
							getAccessToken: getAuthenticationToken(),
							getRuntimeToken: getAuthenticationToken(),
							locale: "en"
						}, monitorOptions.executionStatusJSON);
					};

					flowConfigurationOptions = {
						apiVersion: monitorOptions.ApiVersion,
						analyticsServiceFactory: function (version) {
							return new HostService.Analytics(rpc, monitorOptions, version);
						},
						features: FeaturesToEnable,
						builtInTypeServiceFactory: builtInTypeServiceFactory,
						operationManifestServiceFactory: operationManifestServiceFactory,
						urlService: urlService,
						connectionServiceFactory: connectionServiceFactory,
						//recommendationServiceFactory: recommendationServiceFactory,
						runInstanceServiceFactory: runInstanceServiceFactory,
						runServiceFactory: runServiceFactory,
						locale: LOCALE
					};
					monitor = new DesignerCore.Monitor(flowConfigurationOptions, document.getElementById("app"));
					return true;
				});
				rpc.register(SharedDefines.DesignerMessages.RenderMonitor, function (runId) {
					//disposeMonitor();

					monitor = new DesignerCore.Monitor(flowConfigurationOptions, document.getElementById("app"));
					return monitor.loadRun(runId).then(function () {
						monitor.render();

					});
				});

				rpc.register("renderTriggerData", function (triggerHistoryId, triggerId) {
					disposeMonitor();

					monitor = new DesignerCore.Monitor(flowConfigurationOptions, element);
					return monitor.loadTriggerHistory(triggerHistoryId, triggerId).then(function () {
						monitor.render();
					});
				});

				rpc.register("refreshMonitor", function (runId) {
					if (monitor) {
						return monitor.refreshRun(runId);
					}
				});

				rpc.register("disposeMonitor", function () {
					disposeMonitor();
				});



				function disposeMonitor() {
					if (monitor) {
						// TODO(joechung): Use monitor.dispose() after it is fixed
						ReactDOM.unmountComponentAtNode(element);
						monitor = null;
					}
				}

				try {
					rpc.ack().then(
						function (res) {
							console.log("Monitor handshake done " + res);
							rpc.call(SharedDefines.WrapperMessages.MonitorInitDone);
						},
						function (err) {
							console.log("Monitor handshake err " + err);

						});
					console.log("RPC ack called");
				}
				catch (error) {
					console.log("Error in ack " + error);
				}
                /*},
                function (error) {

                },
                "my_monaco_chunk"*/
				//);    
			});
		});
	});
}

startInit();