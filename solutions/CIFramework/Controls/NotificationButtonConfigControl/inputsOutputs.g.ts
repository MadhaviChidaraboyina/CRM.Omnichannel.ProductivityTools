module MscrmControls.Service.CIProvider {
	export interface IInputBag
	{
		value: Mscrm.SingleLineProperty;
		accept_buttontext: Mscrm.SingleLineProperty;
		reject_buttontext: Mscrm.SingleLineProperty;
	}

	export interface IOutputBag
	{
		value: string;
		accept_buttontext: string;
		reject_buttontext: string;
	}
}
