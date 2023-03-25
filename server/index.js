console.log('Derp')

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

app.get("/api", (req, res) => {
  // res.json({message: "Strength +4"})
  res.json([
    {type: "5e", desc: "Strength +3", modi: 3},
    {type: "5e", desc: "Dex +1", modi: 1},
    {type: "dw", desc: "Spout Lore +2", modi: 2},
    {type: "bitd", desc: "Wreck 3d", modi: 3}
  ]);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

