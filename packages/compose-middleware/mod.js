const composeMiddleware = (fns) => {
  return function handler(req, res) {
    let i = 0;

    return step();

    function step() {
      const m = fns[i];
      
      if (!m) return;
      
      i += 1;

      return m(req, res, step)
    }
  }
}

export default composeMiddleware;