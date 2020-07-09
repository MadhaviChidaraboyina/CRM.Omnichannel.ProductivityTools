describe("Slug Test Suite", function () {
    var ocConnector = Microsoft.ProductivityMacros.Internal.ProductivityMacroConnector;
    var sessionConnector = Microsoft.ProductivityMacros.Internal.ProductivityMacroConnector;
    beforeEach(() => {
        ocConnector.callback = "ocConnectorcallback";
        sessionConnector.callback = "sessionConnectorcallback";
        Microsoft.ProductivityMacros.Internal.ProductivityMacroOperation.macroConnectorTemplates.set("oc", ocConnector);
        Microsoft.ProductivityMacros.Internal.ProductivityMacroOperation.macroConnectorTemplates.set("session", sessionConnector);
    });

    it("Null input string",async () => {
        var result = await Microsoft.ProductivityMacros.Internal.resolveTemplateString(null, "", "");
        expect(result).toBeNull();
    });

    it("Constant input string", async () => {
        var constantString = "test";
        var result = await Microsoft.ProductivityMacros.Internal.resolveTemplateString(constantString, "", "");
        expect(result).toEqual(constantString);
    });

    it("Slug with OC connector: ${$OC.customerId}", async () => {
        var slug = "${$OC.customerId}";
        var expectedResult = "someCustomerId";
        Microsoft.ProductivityMacros.Internal.resolveSlugInCallback = jasmine.createSpy().and.returnValue(Promise.resolve(expectedResult));
        var result = await Microsoft.ProductivityMacros.Internal.resolveTemplateString(slug, "", "");
        expect(result).toEqual(expectedResult);
    });

    it("Slug with OC connector without $: {$OC.customerId}", async () => {
        var slug = "{$OC.customerId}";
        var expectedResult = "someCustomerId";
        Microsoft.ProductivityMacros.Internal.resolveSlugInCallback = jasmine.createSpy().and.returnValue(Promise.resolve(expectedResult));
        var result = await Microsoft.ProductivityMacros.Internal.resolveTemplateString(slug, "", "");
        expect(result).toEqual(expectedResult);
    });

    it("Slug with Session connector: ${$Session.customerId}", async () => {
        var slug = "${$Session.customerId}";
        var expectedResult = "someCustomerId";
        Microsoft.ProductivityMacros.Internal.resolveSlugInCallback = jasmine.createSpy().and.returnValue(Promise.resolve(expectedResult));
        var result = await Microsoft.ProductivityMacros.Internal.resolveTemplateString(slug, "", "");
        expect(result).toEqual(expectedResult);
    });

    it("Slug with Session connector without $: {$Session.customerId}", async () => {
        var slug = "{$Session.customerId}";
        var expectedResult = "someCustomerId";
        Microsoft.ProductivityMacros.Internal.resolveSlugInCallback = jasmine.createSpy().and.returnValue(Promise.resolve(expectedResult));
        var result = await Microsoft.ProductivityMacros.Internal.resolveTemplateString(slug, "", "");
        expect(result).toEqual(expectedResult);
    });

    it("Slug without connector prefix and no value in session dictionary: ${customerId}", async () => {
        var slug = "${customerId}";
        Microsoft.ProductivityMacros.Internal.resolveSlugInCallback = jasmine.createSpy().and.returnValue(Promise.resolve(""));
        var result = await Microsoft.ProductivityMacros.Internal.resolveTemplateString(slug, "", "");
        expect(result).toEqual("");
    });

    it("Slug without $ prefix and no value in session dictionary: {customerId}", async () => {
        var slug = "{customerId}";
        Microsoft.ProductivityMacros.Internal.resolveSlugInCallback = jasmine.createSpy().and.returnValue(Promise.resolve(""));
        var result = await Microsoft.ProductivityMacros.Internal.resolveTemplateString(slug, "", "");
        expect(result).toEqual("");
    });

    it("Slug without connector prefix and value resolved from connector callback: ${customerId}", async () => {
        var slug = "${customerId}";
        var expectedResult = "someCustomerId";
        Microsoft.ProductivityMacros.Internal.resolveSlugInCallback = jasmine.createSpy().and.returnValue(Promise.resolve(expectedResult));
        var result = await Microsoft.ProductivityMacros.Internal.resolveTemplateString(slug, "", "");
        expect(result).toEqual(expectedResult);
    });

    it("String containing slug: Hello ${customerId}! How can I help you", async () => {
        var slug = "Hello ${customerId}! How can I help you";
        var slugResult = "someCustomerId";
        var expectedResult = "Hello someCustomerId! How can I help you";
        Microsoft.ProductivityMacros.Internal.resolveSlugInCallback = jasmine.createSpy().and.returnValue(Promise.resolve(slugResult));
        var result = await Microsoft.ProductivityMacros.Internal.resolveTemplateString(slug, "", "");
        expect(result).toEqual(expectedResult);
    });

    it("String containing multiple slugs: Hello ${customerId}! How can I help you with {Product}", async () => {
        var slug = "Hello ${customerId}! How can I help you with {Product}";
        var slugResult1 = "someCustomerId";
        var slugResult2 = "someProduct";
        var expectedResult = "Hello someCustomerId! How can I help you with someProduct";
        Microsoft.ProductivityMacros.Internal.resolveSlugInCallback = jasmine.createSpy().and.callFake((a, b) => {
            if (b == "customerId") {
                return Promise.resolve(slugResult1);
            } else if (b == "Product") {
                return Promise.resolve(slugResult2);
            }
            else {
                return Promise.resolve("");
            }
        });
        var result = await Microsoft.ProductivityMacros.Internal.resolveTemplateString(slug, "", "");
        expect(result).toEqual(expectedResult);
    });

    it("Slug for accessing currentTab: ${$Session.Session.CurrentTab.entityId}", async () => {
        var slug = "${$Session.Session.CurrentTab.entityId}";
        var expectedResult = "26596995-85d6-433a-89ad-0ca3ed9407c9";
        Microsoft.ProductivityMacros.Internal.resolveSlugInCallback = jasmine.createSpy().and.callFake((a, b) => {
            if (a == "sessionConnectorcallback") {
                return Promise.resolve(expectedResult);
            }
            else {
                return Promise.resolve("");
            }
        });
        var result = await Microsoft.ProductivityMacros.Internal.resolveTemplateString(slug, "", "");
        expect(result).toEqual(expectedResult);
    });

    it("Slug for accessing anchorTab without $Session prefix: ${Session.CurrentTab.entityId}", async () => {
        var slug = "${$Session.Session.CurrentTab.entityId}";
        var expectedResult = "26596995-85d6-433a-89ad-0ca3ed9407c9";
        Microsoft.ProductivityMacros.Internal.resolveSlugInCallback = jasmine.createSpy().and.callFake((a, b) => {
            if (a == "sessionConnectorcallback") {
                return Promise.resolve(expectedResult);
            }
            else {
                return Promise.resolve("");
            }
        });
        var result = await Microsoft.ProductivityMacros.Internal.resolveTemplateString(slug, "", "");
        expect(result).toEqual(expectedResult);
    });

    it("Slug for accessing currentTab in a string: For ${$Session.Session.CurrentTab.entityName}", async () => {
        var slug = "For ${$Session.Session.CurrentTab.entityName}";
        var slugResult = "product";
        var expectedResult = "For product";
        Microsoft.ProductivityMacros.Internal.resolveSlugInCallback = jasmine.createSpy().and.callFake((a, b) => {
            if (a == "sessionConnectorcallback") {
                return Promise.resolve(slugResult);
            }
            else {
                return Promise.resolve("");
            }
        });
        var result = await Microsoft.ProductivityMacros.Internal.resolveTemplateString(slug, "", "");
        expect(result).toEqual(expectedResult);
    });

    it("Odata {$odata.incident._customerid_value.?$filter=incidentid eq '{$Session.Session.CurrentTab.entityId}'&$select=_customerid_value}", async () => {
        var slug = "{$odata.incident._customerid_value.?$filter=incidentid eq '{$Session.Session.CurrentTab.entityId}'&$select=_customerid_value}";
        var expectedResult = "26596995-85d6-433a-89ad-0ca3ed9407c9";
        var incidentId = "e9eebcdf-48e0-4a04-af17-2e146791a205";
        Microsoft.ProductivityMacros.Internal.resolveSlugInCallback = jasmine.createSpy().and.callFake((a, b) => {
            if (a == "sessionConnectorcallback" && b == "Session.CurrentTab.entityId") {
                return Promise.resolve(incidentId);
            }
            else {
                return Promise.resolve("");
            }
        });
        pending("to check mocking XRM calls");
        //Xrm.WebApi.retrieveMultipleRecords = jasmine.createSpy().and.returnValue(Promise.resolve(expectedResult));
        //var result = await Microsoft.ProductivityMacros.Internal.resolveTemplateString(slug, "", "");
        //expect(result).toEqual(expectedResult);
    });

    it("Output params in template", () => {
        pending("to be implemented");
    })
});