exports.registerRoutes = function (app){
  app.get('/restricted', authenticated, function (req, res) {
    res.status(200).json({ "message": "You are good to go" })
  });
}