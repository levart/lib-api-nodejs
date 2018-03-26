import request from "./requestHandler";
import TwizoError from "../twizoError";

/**
 * Create a request with the following info:
 * @param path 		URL path to send the request to
 * @param method 	HTTP method for the request, defaults to GET
 * @param body 		Optional body to send with the request
 */
const requestWithOptions = (path:string, method?:string, body?: string) => {	
	if (path.charAt(0) !== "/") path = "/" + path;
	const options = {
		host: process.env.TWIZO_HOST,
		path: path,
		method: method || 'GET',
		headers: {
		"Accept": "application/json",
		"Content-Type": "application/json; charset=utf8"
		},
		auth: "twizo:" + process.env.TWIZO_API_KEY
	}
	if (body) {
		(options.headers as any)["Content-Length"] = Buffer.byteLength(body);
		return request(options, body);
	} else return request(options);
}

/**
 * Send a GET request
 * @param path 	URL path from the endpoint
 */
export const get = (path: string): Promise<any> => {
	if (!path) throw new TwizoError("Argument \"path\" not specified")
	else return requestWithOptions(path);
}

/**
 * Send a POST request
 * @param path 	URL path to the endpoint
 * @param body 	JSON string to send as body
 */
export const post = (path: string, body: string): Promise<any> => {
	if (!path) throw new TwizoError("Argument \"path\" not specified")
	else if (!body) throw new TwizoError("Argument \"body\" not specified")
	else return requestWithOptions(path, "POST", body);
}

/**
 * Send a PUT request
 * @param path 	URL path to the endpoint
 * @param body 	JSON string to send as body
 */
export const put = (path: string, body: string): Promise<any> => {
	if (!path) throw new TwizoError("Argument \"path\" not specified")
	else if (!body) throw new TwizoError("Argument \"body\" not specified")
	else return requestWithOptions(path, "PUT", body);
}

/**
 * Send a DELETE request
 * @param path 			URL path to the endpoint
 * @param identifier 	Identifier ID for the item to delete
 */
export const del = (path: string): Promise<any> => {
	if (!path) throw new TwizoError("Argument \"path\" not specified")
	else return requestWithOptions(path, "DELETE");
}
