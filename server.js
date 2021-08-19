// Import modules
const express = require('express');
const path = require('path');
const router = express.Router();
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

// Constants
const dbname = 'lcOnlineMenu';
const collnames = {
  "MAIN": ["main_starters", "main_pasta", "main_fish", "main_pork", "main_beef", "main_lamb", "main_chicken", "main_specialties"],
  "BREAKFAST": ["breakfast", "breakfast_brunch", "breakfast_drinks"],
  "DRINKS": ["drinks_beer", "drinks_soda", "drinks_water", "drinks_coffee", "drinks_mix_local", "drinks_mix_imported", "drinks_spirits", "drinks_liqueur", "drinks_milkshakes"],
  "PASTA": ["pasta", "pasta_other"],
  "SPANISH": ["spanish_starters", "spanish_tortilla", "spanish_paella"],
  "MEXICAN": ["mexican"],
  "PIZZAS": ["pizza_classic", "pizza_special"],
  "CHILDREN": ["children"],
  "DESSERTS": ["dessert_ice_cream", "dessert_milkshakes", "dessert_warm"]
};

// Variables
let language = 'en';  // by default, language is english
let flag_path = 'img/uk.png';

// Init App and Database
const app = express();
let db

let mongoDBCred = fs.readFileSync("backend/mongoDB.txt", (err, data) => {
  if (err) throw err
  return data
});

let uri = `mongodb+srv://joflesan:${mongoDBCred.toString()}@lccluster.8z8vl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// Set View Engine
app.engine('pug', require('pug').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, "/public/")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


function getMenuData(page_to_load) {
  let menuData = []
  for (let i = 0; i < collnames[page_to_load].length; i++) {
    menuData.push(getSectionData(page_to_load, i))
  }

  return Promise.all(menuData)
}

function getSectionData(page_to_load, section_to_load) {

  return new Promise((resolve, reject) => {

    MongoClient.connect(
      uri,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, db) => {
        let dbo = db.db('lcOnlineMenu')
        if (err) throw err

        let collectionData = []

        dbo.collection(collnames[page_to_load][section_to_load]).find({}).forEach((doc, err) => {

          if (doc.hasOwnProperty('section_title')) {
            collectionData.unshift(doc)
          } else if (!err) {
            collectionData.push(doc)
          }

        }, (err) => {
          err ? reject(err) : resolve(collectionData)
          db.close()
        })

      })

  })
}

// POST routes

router.post('/changeLang', (req, res) => {

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

router.post('/getDesc', (req, res) => {
  let menuItem = req.body.id

  // Send some data to the client

})

// GET Routes

app.get('/main', (req, res) => {
  getMenuData("MAIN").then((menuData) => {
    res.render("skeleton.pug", { dishes: menuData, lg: language, flagPath: flag_path });
  })
});

app.get('/breakfast', async (req, res) => {
  getMenuData("BREAKFAST").then((menuData) => {
    res.render("skeleton.pug", { dishes: menuData, lg: language, flagPath: flag_path })
  })
});

app.get('/drinks', async (req, res) => {
  getMenuData("DRINKS").then((menuData) => {
    console.log(menuData)
    res.render("skeleton.pug", { dishes: menuData, lg: language, flagPath: flag_path })
  })
});

app.get('/pasta', async (req, res) => {
  getMenuData("PASTA").then((menuData) => {
    res.render("skeleton.pug", { dishes: menuData, lg: language, flagPath: flag_path })
  })
});

app.get('/spanish', async (req, res) => {
  getMenuData("SPANISH").then((menuData) => {
    res.render("skeleton.pug", { dishes: menuData, lg: language, flagPath: flag_path })
  })
});

app.get('/mexican', async (req, res) => {
  getMenuData("MEXICAN").then((menuData) => {
    res.render("skeleton.pug", { dishes: menuData, lg: language, flagPath: flag_path })
  })
});

app.get('/pizzas', async (req, res) => {
  getMenuData("PIZZAS").then((menuData) => {
    res.render("skeleton.pug", { dishes: menuData, lg: language, flagPath: flag_path })
  })
});

app.get('/children', async (req, res) => {
  getMenuData("CHILDREN").then((menuData) => {
    res.render("skeleton.pug", { dishes: menuData, lg: language, flagPath: flag_path })
  })
});

app.get('/desserts', async (req, res) => {
  getMenuData("DESSERTS").then((menuData) => {
    res.render("skeleton.pug", { dishes: menuData, lg: language, flagPath: flag_path })
  })
});

app.use(express.static(path.join(__dirname, '/')), router)

app.listen(5500, function () {
  console.log('Web app listening on port 5500');
});
