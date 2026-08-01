const service = require("../services/insight.service");

const getAll = async (req, res, next) => {
  try {
    const data = await service.getInsights();
 console.log("Documents:", data.length);
    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (err) {
    next(err);
  }
};

const getByCountry = async (req, res, next) => {
  try {
    const data = await service.getCountryInsights(req.params.country);

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getBySector = async (req, res, next) => {
  try {
    const data = await service.getSectorInsights(req.params.sector);

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getByTopic = async (req, res, next) => {
  try {
    const data = await service.getTopicInsights(req.params.topic);

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getByRegion = async (req, res, next) => {
  try {
    const data = await service.getRegionInsights(req.params.region);

    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getByCountry,
  getBySector,
  getByTopic,
  getByRegion
};