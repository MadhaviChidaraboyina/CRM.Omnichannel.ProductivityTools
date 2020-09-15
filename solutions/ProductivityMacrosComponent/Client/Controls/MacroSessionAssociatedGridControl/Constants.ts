/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/


module MscrmControls.Grid {
	'use strict';

	export class XMLConstants {
		//FetchXML to get Macro Run Histories for all Macros
		public static fetchXML = "<fetch version=\"1.0\" output-format=\"xml-platform\" mapping=\"logical\" distinct=\"false\"><entity name=\"msdyn_macrosession\"><attribute name=\"msdyn_macrosessionid\" /><attribute name=\"modifiedon\" /><attribute name=\"ownerid\" /><attribute name=\"msdyn_name\" /><attribute name=\"msdyn_status\" /><order attribute=\"modifiedon\" descending=\"true\" /><filter type=\"and\"><condition attribute=\"statecode\" operator=\"eq\" value=\"0\" /></filter></entity></fetch>"

		//FetchXML to get Macro Run Histories for the macro from which the link was be opened
		public static fetchXML1 = "<fetch version=\"1.0\" output-format=\"xml-platform\" mapping=\"logical\" distinct=\"false\"><entity name=\"msdyn_macrosession\"><attribute name=\"msdyn_macrosessionid\" /><attribute name=\"modifiedon\" /><attribute name=\"ownerid\" /><attribute name=\"msdyn_name\" /><attribute name=\"msdyn_status\" /><order attribute=\"modifiedon\" descending=\"true\" /><filter type=\"and\"><condition attribute=\"statecode\" operator=\"eq\" value=\"0\" /><condition attribute=\"msdyn_macroname\" operator=\"eq\" value=\"{"
		public static fetchXML2 = "}\" /></filter></entity></fetch>"

		public static layoutXML =
			"<grid name=\"msdyn_macrosessions\" jump=\"msdyn_name\" select=\"1\" icon=\"1\" preview=\"1\"><row name=\"msdyn_macrosession\" id=\"msdyn_macrosessionid\"><cell name=\"msdyn_name\" width=\"100\" /><cell name=\"ownerid\" width=\"100\" /><cell name=\"msdyn_status\" width=\"100\" /><cell name=\"modifiedon\" width=\"100\" /></row></grid>"

	}

	export class Constants {
		public static macroSessionEntityName = "msdyn_macrosession";
		public static macroSessionEntityDisplayName = "Run History";
	}
}