/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="../privatereferences.ts"/>

module MscrmControls.Callscript {
	'use strict';

	export class LiveRegion {

		public static LiveRegionId = "AgentScript_AriaLiveRegion";

		public static getLiveRegion(context: Mscrm.ControlData<IInputBag>): Mscrm.Component {
			return context.factory.createElement(
				"CONTAINER",
				{
					id: this.LiveRegionId,
					key: this.LiveRegionId,
					role: "alert",
					style: {
						position: "absolute!important",
						clip: "rect(1px,1px,1px,1px)",
						display: "block",
					},
					accessibilityLive: "assertive",
				},
				""
			);
		}

	}
}