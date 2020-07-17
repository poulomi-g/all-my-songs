const express = require("express");
const app = express();

const { getTrackingInfo } = require("./track");

app.use(express.json());

app.get("/:id", async (req, res) => {
  const data = await getTrackingInfo(req.params.id);

  res.send({ data });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
