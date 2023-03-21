console.log('Derp')

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

app.get("/api", (req, res) => {
  // res.json({message: "Strength +4"})
  res.json([
    {desc: "Strength +3", modi: 3},
    {desc: "Dex +1", modi: 1}
  ]);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

