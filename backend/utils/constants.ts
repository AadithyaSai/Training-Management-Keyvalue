import { StringValue } from "ms";

export const JWT_SECRET: string = process.env.JWT_SECRET;
export const JWT_VALIDITY: StringValue = process.env
	.JWT_VALIDITY as StringValue;

export const FASTAPI_URL: string = process.env.FASTAPI_ENDPOINT;

export const ENABLE_AI: boolean = process.env.ENABLE_AI === "true";
