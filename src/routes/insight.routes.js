const express = require("express");

const router = express.Router();

const controller = require("../controllers/insight.controller");

router.get("/", controller.getAll);

router.get("/country/:country", controller.getByCountry);

router.get("/sector/:sector", controller.getBySector);

router.get("/topic/:topic", controller.getByTopic);

router.get("/region/:region", controller.getByRegion);

module.exports = router;