import { type IncomingMessage, type ServerResponse } from "node:http";

export type Next = () => Promise<void> | void;

export type Middleware = (
	request: IncomingMessage,
	response: ServerResponse,
	next: Next,
) => Promise<void> | void;

export type Handler = (request: IncomingMessage, response: ServerResponse) => void;

export type ErrorHandle = {
	shouldHandle(error: any): boolean;
	handle(request: IncomingMessage, response: ServerResponse, error: any): void | Promise<void>;
};

export type ErrorLog = (error: any) => void;
