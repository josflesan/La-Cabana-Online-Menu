// Import express
const express = require('express');
const path = require('path'); 
const bodyParser = require('body-parser');
const router = express.Router();

// Init App
const app = express();

// Set View Engine
app.engine('pug', require('pug').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, "/public/")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Get MongoClient
const MongoClient = require('mongodb').MongoClient;

// db url, collection name and db name
const dburl = "mongodb+srv://joflesan:anjomima0@lccluster.8z8vl.mongodb.net/test";
const dbname = "lcOnlineMenu";
const collnames = { "MAIN": ["starters_soups", "pasta_and_eggs", "fish", "meat", "specialties_and_flambes"],
                    "BREAKFAST": ["breakfast", "breakfast_extras"],
                    "DRINKS": [],
                    "PASTA": [],
                    "MEXICAN": [],
                    "PIZZAS": [],
                    "CHILDREN": [],
                    "DESSERTS": [] };

var language = 'en';  // by default, language is english
var page = 'MAIN';  // by default, open main menu
var flag_path = 'img/uk.png';

// Change Language
router.post('/changeLang', function(req, res) {

  switch(req.body.lang) {

    case 'ENGLISH': 
      language = 'en';
      flag_path = 'img/uk.png';
      break;

    case 'ESPAÑOL':
      language = 'es';
      flag_path = 'img/spain.png';
      break;

    case 'NORSK':
      language = 'nw';
      flag_path = 'img/norway.png';
      break;

    case 'DEUTSCH':
      language = 'de';
      flag_path = 'img/germany.png';
      break;

    case 'SVENSKA':
      language = 'sw';
      flag_path = 'img/sweden.png';
      break;

    case 'SUOMI':
      language = 'fn';
      flag_path = 'img/finland.png';
      break;

    case 'DANSK':
      language = 'dk';
      flag_path = 'img/denmark.png';
      break;

    case 'NEDERLANDS':
      language = 'hl';
      flag_path = 'img/netherlands.png';
      break;

    case 'ITALIANO':
      language = 'it';
      flag_path = 'img/italy.png';
      break;

    case 'FRANÇAIS':
      language = 'fr';
      flag_path = 'img/france.png';
      break;
  }

});

// Change Page
router.post('/changePage', function (req, res) {
    console.log(req.body.selected);
    page = req.body.selected;
});

router.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, "/public/pages/test.html"));
});



// Home Route
router.get('/', function (req, res) {

  // JSON output
  var output = [];

  // Callback Count
  var callbackNum = 0;

  // Connect to db
  MongoClient.connect(
    dburl,
    {useNewUrlParser: true},
    (err, client) => {

      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }

      // Get db
      const db = client.db(dbname);

      // Cycle through all of the collections
      for(col = 0; col < collnames[page].length; col++) {
        // Get collection
        const collection = db.collection(collnames[page][col]);

        // Array to hold each collection data temporarily
        var collectionData = []

        // Find all documents in the collection        
        collection.find({}).forEach(function(doc, err) {
          if (!err) {
            collectionData.push(doc)
          } 
        }, function() {
          callbackNum++;
          output.push(collectionData);
          collectionData = [];  // reset collectionData

          if (callbackNum == collnames[page].length) {
            // send output in template
            console.log(output);
            res.render("index.pug", { dishes: output, lg: language, flag: flag_path });
          } 
        });
      }

      // close client
      client.close();
    }
  );
});  

app.use(express.static(path.join(__dirname, '/')), router)

app.listen(5500, function() {
    console.log('Web app listening on port 5500');
});

