const repository = require("../repositories/insight.repository");

const getInsights = () => repository.getAll();

const getCountryInsights = (country) =>
  repository.getByCountry(country);

const getSectorInsights = (sector) =>
  repository.getBySector(sector);

const getTopicInsights = (topic) =>
  repository.getByTopic(topic);

const getRegionInsights = (region) =>
  repository.getByRegion(region);

module.exports = {
  getInsights,
  getCountryInsights,
  getSectorInsights,
  getTopicInsights,
  getRegionInsights
};