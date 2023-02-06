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

    describe("splitOdataSlug", () => {
        it.each`
          expectElement1         | expectElement2                                                            | expectElement3                                                                                   | input
          ${"incident"}          | ${"_customerid_value@OData.Community.Display.V1.FormattedValue"}          | ${"?$filter=incidentid eq '6194b723-7e5f-eb11-a812-000d3a1a658a'"}                               | ${"$odata.incident._customerid_value@OData.Community.Display.V1.FormattedValue.?$filter=incidentid eq '6194b723-7e5f-eb11-a812-000d3a1a658a'"}
          ${"incident"}          | ${"title"}                                                                | ${"?$filter=incidentid eq '{caseId}'&$select=title"}                                             | ${"$odata.incident.title.?$filter=incidentid eq '{caseId}'&$select=title"}
          ${"contact"}           | ${"_parentcustomerid_value"}                                              | ${"?$filter=contactid eq '{customerRecordId}'"}                                                  | ${"$Odata.contact._parentcustomerid_value.?$filter=contactid eq '{customerRecordId}'"}
          ${"incident"}          | ${"_customerid_value"}                                                    | ${"?$filter=incidentid eq '{entityRoutingRecordId}"}                                             | ${"$odata.incident._customerid_value.?$filter=incidentid eq '{entityRoutingRecordId}"}
          ${"incident"}          | ${"casetypecode@OData.Community.Display.V1.FormattedValue"}               | ${"?$filter=incidentid eq '{entityRoutingRecordId}'&$select=casetypecode"}                       | ${"$odata.incident.casetypecode@OData.Community.Display.V1.FormattedValue.?$filter=incidentid eq '{entityRoutingRecordId}'&$select=casetypecode"}
          ${"incident"}          | ${"_customerid_value"}                                                    | ${"?$filter=incidentid eq '{anchor._regardingobjectid_value}'&$select=_customerid_value"}        | ${"$odata.incident._customerid_value.?$filter=incidentid eq '{anchor._regardingobjectid_value}'&$select=_customerid_value"}
          ${"msdyn_workorder"}   | ${"msdyn_workorderid"}                                                    | ${"?$orderby=createdon desc&$top=1"}                                                             | ${"$odata.msdyn_workorder.msdyn_workorderid.?$orderby=createdon desc&$top=1"}
          ${"msdyn_workorder"}   | ${"msdyn_workorderid"}                                                    | ${"?$filter=msdyn_name eq 'WO-1168'"}                                                            | ${"$odata.msdyn_workorder.msdyn_workorderid.?$filter=msdyn_name eq 'WO-1168'"}
          ${"account"}           | ${"accountnumber"}                                                        | ${"?$filter=accountid eq '{customerRecordId}'&$select=accountnumber"}                            | ${"$odata.account.accountnumber.?$filter=accountid eq '{customerRecordId}'&$select=accountnumber"}
          ${"msdyn_workorder"}   | ${"msdyn_workorderid"}                                                    | ${"?$orderby=createdon desc&$top=1&$select=msdyn_workorderid"}                                   | ${"$odata.msdyn_workorder.msdyn_workorderid.?$orderby=createdon desc&$top=1&$select=msdyn_workorderid"}
          ${"incident"}          | ${"_gcct_fmcccontract_value"}                                             | ${"?$filter=incidentid eq '{entityRoutingRecordId}'&$select=_gcct_fmcccontract_value"}           | ${"$odata.incident._gcct_fmcccontract_value.?$filter=incidentid eq '{entityRoutingRecordId}'&$select=_gcct_fmcccontract_value"}
          ${"incident"}          | ${"incidentid"}                                                           | ${"?$filter=_customerid_value eq '{anchor.contactid}' and statecode eq 0&$select=incidentid&$orderby=modifiedon%20desc&$top=1"}        | ${"$odata.incident.incidentid.?$filter=_customerid_value eq '{anchor.contactid}' and statecode eq 0&$select=incidentid&$orderby=modifiedon%20desc&$top=1"}
        `(
          "$string1 compared to $string2 returns $expectedResult",
          ({ expectElement1, expectElement2, expectElement3, input}) => {
            expect(Internal.splitOdataSlug(input)).toEqual([expectElement1, expectElement2, expectElement3]);
          }
        );
      });
});
