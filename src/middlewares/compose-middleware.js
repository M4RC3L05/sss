const composeMiddleware = (fns) => {
    return function handler(request, response) {
        let i = 0;
        return step();
        async function step() {
            const m = fns[i];
            if (!m)
                return;
            i += 1;
            return m(request, response, step);
        }
    };
};
export default composeMiddleware;
