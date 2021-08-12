// Import express
const express = require('express');
const path = require('path');
const router = express.Router();
const fs = require('fs');

// Init App
const app = express();

// Set View Engine
app.engine('pug', require('pug').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, "/public/")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Get MongoClient
const { MongoClient } = require('mongodb');

// JSON database output
let output = [];

const dbname = 'lcOnlineMenu';
const collnames = {
  "MAIN": ["starters_soups", "pasta_and_eggs", "fish", "meat", "specialties_and_flambes"],
  "BREAKFAST": ["breakfast", "breakfast_extras"],
  "DRINKS": [],
  "PASTA": [],
  "MEXICAN": [],
  "PIZZAS": [],
  "CHILDREN": [],
  "DESSERTS": []
};

let language = 'en';  // by default, language is english
let page = 'MAIN';  // by default, open main menu
let flag_path = 'img/uk.png';

async function main() {

  mongoDBCred = fs.readFileSync("backend/mongoDB.txt", (err, data) => {
    if (err) throw err
    return data
  });

  /**
   * Connection URI. 
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
   */
  const uri = `mongodb+srv://joflesan:${mongoDBCred.toString()}@lccluster.8z8vl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB cluster
    await client.connect();

    // Callback Count
    let callbackNum = 0;

    // Connect to db
    MongoClient.connect(
      uri,
      { useNewUrlParser: true },
      (err, client) => {

        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }

        // Get db
        const db = client.db(dbname);

        // Cycle through all of the collections
        for (col = 0; col < collnames[page].length; col++) {
          // Get collection
          const collection = db.collection(collnames[page][col]);

          // Array to hold each collection data temporarily
          let collectionData = []

          // Find all documents in the collection  
          collection.find().forEach(function (doc, err) {

            if (doc.hasOwnProperty('section_title')) {
              collectionData.unshift(doc)
            } else if (!err) {
              collectionData.push(doc)
            }
          }, function () {
            callbackNum++;
            output.push(collectionData);
            collectionData = [];  // reset collectionData
          });
        }
      }
    );

  } catch (e) {
    console.error(e);
  } finally {
    client.close();
  }

}

// Change Language
router.post('/changeLang', function (req, res) {

  switch (req.body.lang) {

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

app.get('/main', (req, res) => {
  res.render("main.pug", { dishes: output, lg: language, flagPath: flag_path });
});

app.use(express.static(path.join(__dirname, '/')), router)

app.listen(5500, function () {
  console.log('Web app listening on port 5500');
  main();
});

