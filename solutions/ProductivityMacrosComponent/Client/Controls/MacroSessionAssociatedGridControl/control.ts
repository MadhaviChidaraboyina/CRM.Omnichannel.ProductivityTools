/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */

/// <reference path="privatereferences.ts"/>

module MscrmControls.Grid {
  "use strict";

  export class MacroSessionAssociatedGridControl
    implements Mscrm.Control<IInputBag, IOutputBag>
  {
    private _context: Mscrm.ControlData<IInputBag>;

    private static readonly DEFAULT_SHOW_COUNT: number = 25;
    private static readonly MAX_RECORD_COUNT: number = 5000;
    private XMLConstants: XMLConstants;
    private showCount: number;
    private recordCount: number = -1;
    private layoutXML: string;
    private entityLogicalName: string;
    private entityDisplayName: string;
    private fetchXML: string;
    private guid: string;
    private notifyOutputChanged: () => void;
    private selectedRecords: Mscrm.EntityReference[] = [];
    /**
     * Empty constructor.
     */
    constructor() {}

    /**
     * This function should be used for any initial setup necessary for your control.
     * @params context The "Input Bag" containing the parameters and other control metadata.
     * @params notifyOutputchanged The method for this control to notify the framework that it has new outputs
     * @params state The user state for this control set from setState in the last session
     * @params container The div element to draw this control in
     */
    public init(
      context: Mscrm.ControlData<IInputBag>,
      notifyOutputChanged: () => void,
      state: Mscrm.Dictionary
    ): void {
      this._context = context;
      this.notifyOutputChanged = notifyOutputChanged;
      this.showCount = MacroSessionAssociatedGridControl.DEFAULT_SHOW_COUNT;
      this.guid = this.generateGuid();
    }

    /**
     * This function will recieve an "Input Bag" containing the values currently assigned to the parameters in your manifest
     * It will send down the latest values (static or dynamic) that are assigned as defined by the manifest & customization experience
     * as well as resource, client, and theming info (see mscrm.d.ts)
     * @params context The "Input Bag" as described above
     */
    public updateView(context: Mscrm.ControlData<IInputBag>): Mscrm.Component {
      this._context = context;
      this.extractParameters(context);

      return this.renderMainContainer();
    }

    /**
     * This function will return an "Output Bag" to the Crm Infrastructure
     * The ouputs will contain a value for each property marked as "input-output"/"bound" in your manifest
     * i.e. if your manifest has a property "value" that is an "input-output", and you want to set that to the local variable "myvalue" you should return:
     * {
     *		value: myvalue
     * };
     * @returns The "Output Bag" containing values to pass to the infrastructure
     */
    public getOutputs(): IOutputBag {
      return {
        selectedrecords: this.selectedRecords,
      };
    }

    /**
     * This function will be called when the control is destroyed
     * It should be used for cleanup and releasing any memory the control is using
     */
    public destroy(): void {}

    private extractParameters(context) {
      this.entityLogicalName = Constants.macroSessionEntityName;
      this.entityDisplayName = Constants.macroSessionEntityDisplayName;
      this.fetchXML = XMLConstants.fetchXML;
      if (
        context.mode.fullPageParam != null &&
        context.mode.fullPageParam["recID"] != null
      ) {
        this.fetchXML =
          XMLConstants.fetchXML1 +
          context.mode.fullPageParam["recID"] +
          XMLConstants.fetchXML2;
      }
      this.layoutXML = XMLConstants.layoutXML;
    }

    private generateGuid(): string {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          const r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    }

    // This callback is used to retrieve total result count for the fetchXML query
    private onDataSetUpdate(obj: any) {
      if (
        !this.isNullOrUndefined(obj) &&
        !this.isNullOrEmptyString(obj.existedPagingString)
      ) {
        const pagStringObj = JSON.parse(obj.existedPagingString);

        if (!this.isNullOrUndefined(pagStringObj.totalResultCount)) {
          this.recordCount = pagStringObj.totalResultCount;

          // When actual total record count is greator than 5000, this callback returns -1 as the record count
          // Todo - Find a better solution to this scenario
          if (this.recordCount == -1) this.recordCount = 5001;
          this._context.utils.requestRender();
        }
      }
    }

    private onRecordSelected(selectedRecords: string[]): void {
      this.selectedRecords = selectedRecords
        ? selectedRecords.map((id) => {
            return { Id: id, Name: null, LogicalName: this.entityLogicalName };
          })
        : [];
      this.notifyOutputChanged();
    }

    private renderGrid(): Mscrm.Component {
      const idd = this.guid;

      const properties: any = {
        parameters: {
          TargetEntityType: this.entityLogicalName,
          Items: {
            Type: "Grid",
            onDataSetUpdate: this.onDataSetUpdate.bind(this),
            TargetEntityType: this.entityLogicalName,
            onRecordsSelected: this.onRecordSelected.bind(this),
            BoundViewParams: {
              ViewId: this.guid,
              ViewDisplayName: this.entityDisplayName,
              FetchXml: this.fetchXML,
              LayoutXml: this.layoutXML,
              TargetEntityType: this.entityLogicalName,
            },
            DataSetUIOptions: {
              displayChart: false,
              displayCommandBar: true,
              displayIndex: true,
              displayQuickFind: false,
              displayViewSelector: false,
              displayPaging: true,
            },
          },
          ColumnResizing: {
            Usage: 1,
            Static: true,
            Type: "Enum",
            Value: "Enable",
            Primary: false,
          },
          ColumnMoving: {
            Usage: 1,
            Static: true,
            Type: "Enum",
            Value: "Enable",
            Primary: false,
          },
          ColumnPinning: {
            Usage: 1,
            Static: true,
            Type: "Enum",
            Value: "Disable",
            Primary: false,
          },
          RowSelection: {
            Usage: 1,
            Static: true,
            Type: "Enum",
            Value: "Multiple",
            Primary: false,
          },
          RowHeightMobile: {
            Usage: 1,
            Static: true,
            Type: "Whole.None",
            Value: 72,
            Primary: false,
          },
          RowHeight: {
            Usage: 1,
            Static: true,
            Type: "Whole.None",
            Value: 42,
            Primary: false,
          },
          HeaderHeight: {
            Usage: 1,
            Static: true,
            Type: "Whole.None",
            Value: 42,
            Primary: false,
          },
          SelectionColumn: {
            Usage: 1,
            Static: true,
            Type: "Enum",
            Value: "Enable",
            Primary: false,
          },
          RowStyle: {
            Usage: 1,
            Static: true,
            Type: "Enum",
            Value: "Flat",
            Primary: false,
          },
          GridInnerLeftPadding: {
            Usage: 1,
            Static: true,
            Type: "Whole.None",
            Value: 0,
            Primary: false,
          },
          GridInnerRightPadding: {
            Usage: 1,
            Static: true,
            Type: "Whole.None",
            Value: 0,
            Primary: false,
          },
          JumpBar: {
            Usage: 1,
            Static: true,
            Type: "Enum",
            Value: "Enable",
            Primary: false,
          },
          ReflowBehavior: {
            Usage: 1,
            Static: true,
            Type: "Enum",
            Value: "Reflow",
            Primary: false,
          },
          Footer: {
            Usage: 1,
            Static: true,
            Type: "Enum",
            Value: "Enable",
            Primary: false,
          },
          IsReadOnly: {
            Usage: 1,
            Static: true,
            Type: "Enum",
            Value: "Enable",
            Primary: false,
          },
        },
        key: "DynResultsGrid_" + idd,
        id: "DynResultsGrid_" + idd,
      };

      const gridC = this._context.factory.createComponent(
        "MscrmControls.Grid.PCFGridControl",
        "gridControl - dynResults" + idd,
        properties
      );

      return this._context.factory.createElement(
        "CONTAINER",
        {
          key: "GridContainer",
          id: "GridContainer",
          style: {
            width: "100%",
            height: "100%",
          },
        },
        [gridC]
      );
    }

    private renderMainContainer(): Mscrm.Component {
      const container: Mscrm.Component = this._context.factory.createElement(
        "CONTAINER",
        {
          id: "Container",
          key: "Container",
          style: {
            display: "block",
            width: "100%",
            height: "100%",
            color: this._context.theming.colors.grays.gray05,
            "background-color": this._context.theming.colors.whitebackground,
          },
        },
        this.renderGrid()
      );

      return container;
    }

    private isNullOrEmptyString(obj: any): boolean {
      return this._context.utils.isNullOrEmptyString(obj);
    }

    private isNullOrUndefined(obj: any): boolean {
      return this._context.utils.isNullOrUndefined(obj);
    }
  }
}
