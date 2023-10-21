/// <reference types="node" resolution-mode="require"/>
import { type IncomingMessage, type ServerResponse } from "node:http";
export type Next = () => Promise<void> | void;
export type Middleware = (request: IncomingMessage, response: ServerResponse, next: Next) => Promise<void> | void;
