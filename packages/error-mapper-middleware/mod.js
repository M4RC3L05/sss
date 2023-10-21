const errorMappermiddleware = (mappers = []) => {
  return async function handler(_, res, next) {
     try {
       await next();
     } catch (error) {
       const mapper = mappers.find(m => m.shouldHandle(error));
 
       if (mapper) {
         error = mapper.map(error);
       }
 
       res.writeHead(error?.statusCode ?? 500, { "content-type": "application/json", ...(error?.headers ?? {}) })
       res.end(JSON.stringify(error?.body ?? { error: { message: "Something went wrong" }}));
     }
   }
 }
 
 export default errorMappermiddleware;