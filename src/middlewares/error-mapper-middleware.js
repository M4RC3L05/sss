/** @typedef {import("node:http").IncomingMessage} Request */
/** @typedef {import("node:http").ServerResponse} Response */
/** @typedef {(req: Request, res: Response, next: () => Promise<void> | void) => Promise<void> | void} Middleware */

/**
 * @typedef {Object} MappedError
 * @property {Record<string, unknown>} [headers]
 * @property {Record<string, unknown>} [body]
 */

/**
 * @typedef {Object} ErrorMapper
 * @property {(error: any) => boolean} shouldHandle
 * @property {(error: any) => MappedError} map
 */

/**
 * @param {ErrorMapper[]} mappers
 * @param {(error: any) => void} [log]
 * @returns {Middleware}
 */
const errorMappermiddleware = (mappers = [], log) => {
	return async function handler(_, response, next) {
		try {
			await next();
		} catch (error) {
			log?.(error);

			/** @type {MappedError | undefined} */
			let mapped;
			const mapper = mappers.find((m) => m.shouldHandle(error));

			if (mapper) {
				// eslint-disable-next-line unicorn/no-array-callback-reference
				mapped = mapper.map(error);
			}

			response.writeHead(error?.statusCode ?? 500, {
				"content-type": "application/json",
				...mapped?.headers,
			});
			response.end(JSON.stringify(mapped?.body ?? { error: { message: "Something went wrong" } }));
		}
	};
};

export default errorMappermiddleware;
