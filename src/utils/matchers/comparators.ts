import { Header } from "har-format";

export function jsonEquals(a: string, b: string) {
	try {
		a = JSON.parse(a);
		b = JSON.parse(b);
		a = JSON.stringify(a);
		b = JSON.stringify(b);
		return a === b;
	} catch (e) {
		return false;
	}
}

export const scoreByHeaders = (
	request: {
		[key: string]: string;
	},
	entry: Header[],
) => {
	const matchingHeaders = Object.entries(entry).filter(([, value]) => {
		return request[value.name] === value.value;
	}).length;
	return matchingHeaders;
};
