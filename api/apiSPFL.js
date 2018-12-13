let { PythonShell } = require("python-shell");

var express = require("express");
var hostname = "localhost";
var port = 3000;
var mongoose = require("mongoose");

var options = {
  server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
};

var urlmongo = "mongodb://127.0.0.1:27017/test";

mongoose.connect(
  urlmongo,
  options
);

var db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", function() {
  console.log("Connection done");
});

var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var flowerSchema = mongoose.Schema({
  id: String,
  race: String,
  color: String,
  description: String
});

var bouquetSchema = mongoose.Schema({
  id: String,
  nbFlowers: String,
  Flowers: []
});

var speciesSchema = mongoose.Schema({
  _id: String,
  species: String
});

var Flower = mongoose.model("Flower", flowerSchema);
var Bouquet = mongoose.model("Bouquet", bouquetSchema);
var Species = mongoose.model("Species", speciesSchema);

var myRouter = express.Router();
myRouter.route("/").all(function(req, res) {
  res.json({ message: "Welcome on SPFL API ", methode: req.method });
});

myRouter
  .route("/bouquets")
  .get(function(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    ); // If needed
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    ); // If needed
    res.setHeader("Access-Control-Allow-Credentials", true);
    Bouquet.find(function(err, bouquets) {
      if (err) {
        res.send(err);
      }
      res.json(bouquets);
    });
  })
  .post(function(req, res) {
    var bouquet = new Bouquet();
    bouquet.id = req.body.id;
    bouquet.nbFlowers = req.body.nbFlowers;
    bouquet.Flowers = req.body.Flowers;
    bouquet.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: "New Bouquet add into database" });
    });
  });

myRouter
  .route("/flowers")
  .get(function(req, res) {
    Flower.find(function(err, flowers) {
      if (err) {
        res.send(err);
      }
      res.json(flowers);
    });
  })
  .post(function(req, res) {
    var flower = new Flower();
    flower.id = req.body.id;
    flower.race = req.body.race;
    flower.color = req.body.color;
    flower.description = req.body.description;
    flower.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: "New Flower add into database" });
    });
  });

myRouter
  .route("/flowers/:id")
  .get(function(req, res) {
    Flower.findById(req.params.id, function(err, flower) {
      if (err) res.send(err);
      res.json(flower);
    });
  })
  .put(function(req, res) {
    Flower.findById(req.params.id, function(err, flower) {
      if (err) {
        res.send(err);
      }
      flower.id = req.body.id;
      flower.race = req.body.race;
      flower.color = req.body.color;
      flower.description = req.body.description;
      flower.save(function(err) {
        if (err) {
          res.send(err);
        }
        res.json({ message: "Flower up to date" });
      });
    });
  })
  .delete(function(req, res) {
    Flower.remove({ _id: req.params.id }, function(err, flower) {
      if (err) {
        res.send(err);
      }
      res.json({ message: "Flower deleted" });
    });
  });

myRouter
  .route("/species")
  .get(function(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    ); // If needed
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    ); // If needed
    res.setHeader("Access-Control-Allow-Credentials", true);
    Species.find(function(err, species) {
      if (err) {
        res.send(err);
      }
      res.json(species);
    });
  })
  .post(function(req, res) {
    var species = new Species();
    species.species = req.body.species;
    species.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: "New Species add into database" });
    });
  });

myRouter
  .route("/species/:id")
  .get(function(req, res) {
    Species.findById(req.params.id, function(err, species) {
      if (err) res.send(err);
      res.json(species);
    });
  })
  .put(function(req, res) {
    Species.findById(req.params.id, function(err, species) {
      if (err) {
        res.send(err);
      }
      species._id = req.body._id;
      species.species = req.body.species;
      species.save(function(err) {
        if (err) {
          res.send(err);
        }
        res.json({ message: "Species up to date" });
      });
    });
  })
  .delete(function(req, res) {
    Species.remove({ _id: req.params.id }, function(err, species) {
      if (err) {
        res.send(err);
      }
      res.json({ message: "Species deleted" });
    });
  });

app.use(myRouter);
app.listen(port, hostname, function() {
  console.log("Server available on " + hostname + ":" + port);
});
