const express = require("express");
const app = express();
const cors = require("cors");

const { WebScraper } = require("./track");

app.use(express.json());
app.use(cors());

const scraper = new WebScraper();

app.get("/:id", async (req, res) => {
  const data = await scraper.getTrackingInfo(req.params.id);

  if (data.length == 0) {
    res.send("Could not find tracking data");
  } else {
    res.send(data);
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
