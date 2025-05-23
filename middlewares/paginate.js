module.exports = async (req, res, next) => {
  try {
    const {
      query: { page, results },
    } = req;

    req.pagination = {
      limit: results < 1 || results > 100 ? 20 : results,
      offset: page > 0 ? page * results - results : 0
    }

    next();
  } catch (error) {
    next(error);
  }
};
