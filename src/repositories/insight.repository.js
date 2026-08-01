const Insight = require("../models/insight.model");

const getAll = () => Insight.find();
// const getAll = async () => {
//     console.log("Model:", Insight.modelName);

//     const count = await Insight.countDocuments();
//     console.log("Count:", count);

//     return await Insight.find();
// };
const getByCountry = (country) =>
  Insight.find({ country });

const getBySector = (sector) =>
  Insight.find({ sector });

const getByTopic = (topic) =>
  Insight.find({ topic });

const getByRegion = (region) =>
  Insight.find({ region });

module.exports = {
  getAll,
  getByCountry,
  getBySector,
  getByTopic,
  getByRegion
};