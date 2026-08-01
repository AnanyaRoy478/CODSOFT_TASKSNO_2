const mongoose = require("mongoose");

const insightSchema = new mongoose.Schema(
  {
    end_year: {
      type: String,
      default: ""
    },
    intensity: Number,
    sector: String,
    topic: String,
    insight: String,
    url: String,
    region: String,
    start_year: String,
    impact: String,
    added: String,
    published: String,
    country: String,
    relevance: Number,
    pestle: String,
    source: String,
    title: String,
    likelihood: Number
  },
  {
    timestamps: true,
    collection: "insights_table",
  }
  
);

module.exports = mongoose.model("Insight", insightSchema);