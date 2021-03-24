/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
import { Utils } from "../Utilities/Utils";
import { ToolConfig } from "./ProductivityToolConfig";

export class ProductivityToolsConfig {
  private toolsList: ToolConfig[];

  constructor(toolsList?: ToolConfig[]) {
    this.toolsList = toolsList;
    if (!Utils.isNullOrUndefined(this.toolsList) && this.toolsList.length > 1) {
      this.toolsList.sort((a: ToolConfig, b: ToolConfig) =>
        a.toolPosition > b.toolPosition ? 1 : -1
      );
    }
  }

  public get ToolsList() {
    return this.toolsList;
  }

  public set ToolsList(toolsList: ToolConfig[]) {
    this.toolsList = toolsList;
    if (!Utils.isNullOrUndefined(this.toolsList) && this.toolsList.length > 1) {
      this.toolsList.sort((a: ToolConfig, b: ToolConfig) =>
        a.toolPosition > b.toolPosition ? 1 : -1
      );
    }
  }
}
