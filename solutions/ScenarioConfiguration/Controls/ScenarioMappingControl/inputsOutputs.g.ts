module MscrmControls.Service.CIProvider {
	export interface IInputBag
	{
		value: Mscrm.SingleLineProperty;
		TemplateType: Mscrm.EnumProperty<"notification" | "session">;
		BoundEntityName: Mscrm.SingleLineProperty;
	}

	export interface IOutputBag
	{
		value: string;
	}
}
