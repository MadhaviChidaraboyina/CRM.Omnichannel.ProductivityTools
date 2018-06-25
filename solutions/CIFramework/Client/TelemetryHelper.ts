namespace Microsoft.CIFramework
{
	/**
	 * Methos to log the usage of APIs 
	 * @param result 
	 */
	export function reportUsage(result: string): void
	{
		console.log(result); // TO-DO: use the actual reporting APIs once integrated with UC client.
	}

	/**
	 * Metjhod to log the error of APIs
	 * @param error 
	 */
	export function reportError(error: string): void
	{
		console.log(error); // TO-DO: use the actual reporting APIs once integrated with UC client.
	}

	/**
	 * Generic method to convert map data into string
	 * @param map 
	 */
	export function mapToString(map: Map<string, any>): string
	{
		let result: string;
		map.forEach((value, key) => {
			result += key + " : " + value + ", ";
		});
		return result;
	}

	/**
	 * Gereric function to convert event data into string
	 * @param event 
	 */
	export function eventToString(event: CustomEvent): string
	{
		let result: string;
		const data1 = event.detail["field"];
		const data2 = event.detail["ParentEntityReference"];
		result = "value " + data1["value"] + "\nname " + data1["name"] + "\ntype " + data1["type"] + "\n ParentEntityReference "+ data2["entityType"] + ", ID "+ data2["id"] + ", name : "+ data2["name"];
		return result;
	}
}