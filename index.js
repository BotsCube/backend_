var app = require("express")();

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Hello from BotsCube Backend"
  });
});
app.listen(3000, () => {
  console.log("Started");
});
