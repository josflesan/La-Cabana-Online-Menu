// Import modules
const express = require('express');
const path = require('path');
const router = express.Router();
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient
let ObjectId = require('mongodb').ObjectId
const dotenv = require('dotenv');
const cors = require('cors')
dotenv.config()

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
let page = "MAIN"
let flag_path = `${process.env.IMG_DIR}uk.png`;
let appStrings = {};
let uri = process.env.MONGO_DB_URI;

// Init App and Database
const app = express();

// Set View Engine
app.engine('pug', require('pug').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, process.env.STATIC_DIR)));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


let whitelist = ['http://lacabanapuertorico.com', 'http://www.lacabanapuertorico.com', 'https://lacabanapuertorico.com', 'https://www.lacabanapuertorico.com']
let corsOptions = {
  origin: (origin, callback) => {
    let originIsWhiteListed = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhiteListed)
  },
  methods: ["GET", "PUT", "POST", "DELETE"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
  maxAge: -1
}

app.use(cors(corsOptions))

app.disable('etag');  // Disable caching to fix 304 issue in Safari

async function getAppStrings() {
  return new Promise((resolve, reject) => {

    MongoClient.connect(
      uri,
      { useNewUrlParser: true, useUnifiedTopology: true },
      async (err, db) => {

        app_strings = {}

        try {
          let dbo = db.db(dbname)
          if (err) throw err

          app_strings = await dbo.collection('app_strings').find({}).toArray()

          if (app_strings) {
            resolve(app_strings)
          } else {
            reject("App String Could Not Be Loaded") 
          }

          db.close()
        } catch (e) { console.error(e) }
      }
    )

  }).catch((e) => { console.error(e) })

}

async function getDescriptionData(menu_id) {

  return new Promise((resolve, reject) => {

    MongoClient.connect(
      uri,
      { useNewUrlParser: true, useUnifiedTopology: true },
      async (err, db) => {

        try {
          let dbo = db.db(dbname)
          if (err) throw err

          let foundMenuItem = false
          let menuItemDesc = null
          let col = 0

          while (!foundMenuItem && col < collnames[page].length) {

            menuItemDesc = await dbo.collection(collnames[page][col]).findOne({ "_id": ObjectId(menu_id) })
            
            if (menuItemDesc) {
              let retVal = { ingredients: menuItemDesc.ingredients, options: menuItemDesc.options, labels: menuItemDesc.labels, prices: menuItemDesc.prices }
              resolve(retVal)
            } else {
              col++
            }
          }

          reject("Menu Item Not Found")
          db.close()
        } catch (e) { console.error(e) }
      }
    )

  }).catch((e) => { console.error(e) })

}

async function getReviewData() {
  return new Promise((resolve, reject) => {

    MongoClient.connect(
      uri,
      { useNewUrlParser: true, useUnifiedTopology: true },
      async (err, db) => {
        try {

          let dbo = db.db(dbname)
          if (err) throw err

          reviewContents = await dbo.collection("reviews").find({}).toArray()

          if (reviewContents) {
            resolve(reviewContents)
          } else {
            reject("No Reviews Found")
          }

          db.close()

        } catch (e) { console.error(e) }
      }
    )

  }).catch((e) => { console.error(e) })
}

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
        let dbo = db.db(dbname)
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

  let language;
  let url = req.body.url;

  console.log(`URL in Request: ${url}`)
  console.log(`Language in Request: ${req.body.lang}`)
  console.log("--------------------------------------")

  switch (req.body.lang) {

    case 'ENGLISH':
      console.log("ENGLISH SELECTED")
      language = 'en';
      flag_path = `${process.env.IMG_DIR}/uk.png`;
      break;

    case 'ESPAÑOL':
      console.log("SPANISH SELECTED")
      language = 'es';
      flag_path = `${process.env.IMG_DIR}/spain.png`
      break;

    case 'NORSK':
      console.log("NORWEGIAN SELECTED")
      language = 'nw';
      flag_path = `${process.env.IMG_DIR}/norway.png`;
      break;

    case 'DEUTSCH':
      console.log("GERMAN SELECTED")
      language = 'de';
      flag_path = `${process.env.IMG_DIR}/germany.png`;
      break;

    case 'SVENSKA':
      console.log("SWEDISH SELECTED")
      language = 'sw';
      flag_path = `${process.env.IMG_DIR}/sweden.png`;
      break;

    case 'SUOMI':
      console.log("SUOMI SELECTED")
      language = 'fn';
      flag_path = `${process.env.IMG_DIR}/finland.png`;
      break;

    case 'DANSK':
      console.log("DANISH SELECTED")
      language = 'dk';
      flag_path = `${process.env.IMG_DIR}/denmark.png`;
      break;

    case 'NEDERLANDS':
      console.log("DUTCH SELECTED")
      language = 'hl';
      flag_path = `${process.env.IMG_DIR}/netherlands.png`;
      break;

    case 'ITALIANO':
      console.log("ITALIAN SELECTED")
      language = 'it';
      flag_path = `${process.env.IMG_DIR}/italy.png`;
      break;

    case 'FRANÇAIS':
      console.log("FRENCH SELECTED")
      language = 'fr';
      flag_path = `${process.env.IMG_DIR}/france.png`;
      break;
  }

  console.log(`Language: ${language}`)
  console.log(`Flag Path: ${flag_path}`)

  let lgString = encodeURIComponent(language)
  let flagPathString = encodeURIComponent(flag_path)

  console.log(`Language Encoded: ${lgString}`)
  console.log(`Flag Path Encoded: ${flagPathString}`)

  let env = process.env.NODE_ENV || 'development'
  let redirectUrl = [req.protocol, '://', req.get('Host'), url, '?', "language=", lgString, "&fp=", flagPathString].join('')

  if (env === 'production') {
    redirectUrl = 'https:' + redirectUrl.split(':')[1]
  }

  console.log("--------------------------------")
  console.log(`FINAL REDIRECT URL: ${redirectUrl}`)

  res.json({
    status: "Success",
    body: redirectUrl
  })

});

router.post('/getDesc', async (req, res) => {
  let menuItemId = req.body.id

  getDescriptionData(menuItemId).then((description) => {
    description["active_lang"] = req.body.active_lang ? req.body.active_lang : "en"
    description["app_strings"] = appStrings

    res.json({
      status: "Success",
      body: description
    })
  })

})

// GET Routes

router.get('/*', (req, res, next) => {
  // Disable caching for content files
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", 0);
  next()
})

router.get('/', (req, res) => {
  page = "HOME"

  getReviewData().then((reviews) => {
    let lang = req.query.language ? req.query.language : 'en'
    let fp = req.query.fp ? req.query.fp : 'img/uk.png'
    res.render("home.pug", {reviewList: reviews, apiKey: process.env.MAPS_API_KEY, lg: lang, flagPath: fp, app_strings: appStrings})
  })
})

router.get('/main', (req, res) => {
  page = "MAIN"

  getMenuData("MAIN").then((menuData) => {
    let lang = req.query.language ? req.query.language : 'en'
    let fp = req.query.fp ? req.query.fp : 'img/uk.png'
    res.render("skeleton.pug", { dishes: menuData, lg: lang, flagPath: fp, app_strings: appStrings });
  })
});

router.get('/breakfast', async (req, res) => {
  page = "BREAKFAST"

  getMenuData("BREAKFAST").then((menuData) => {
    let lang = req.query.language ? req.query.language : 'en'
    let fp = req.query.fp ? req.query.fp : 'img/uk.png'
    res.render("skeleton.pug", { dishes: menuData, lg: lang, flagPath: fp, app_strings: appStrings })
  })
});

router.get('/drinks', async (req, res) => {
  page = "DRINKS"

  getMenuData("DRINKS").then((menuData) => {
    let lang = req.query.language ? req.query.language : 'en'
    let fp = req.query.fp ? req.query.fp : 'img/uk.png'
    res.render("skeleton.pug", { dishes: menuData, lg: lang, flagPath: fp, app_strings: appStrings })
  })
});

router.get('/pasta', async (req, res) => {
  page = "PASTA"

  getMenuData("PASTA").then((menuData) => {
    let lang = req.query.language ? req.query.language : 'en'
    let fp = req.query.fp ? req.query.fp : 'img/uk.png'
    res.render("skeleton.pug", { dishes: menuData, lg: lang, flagPath: fp, app_strings: appStrings })
  })
});

router.get('/spanish', async (req, res) => {
  page = "SPANISH"
  
  getMenuData("SPANISH").then((menuData) => {
    let lang = req.query.language ? req.query.language : 'en'
    let fp = req.query.fp ? req.query.fp : 'img/uk.png'
    res.render("skeleton.pug", { dishes: menuData, lg: lang, flagPath: fp, app_strings: appStrings })
  })
});

router.get('/mexican', async (req, res) => {
  page = "MEXICAN"

  getMenuData("MEXICAN").then((menuData) => {
    let lang = req.query.language ? req.query.language : 'en'
    let fp = req.query.fp ? req.query.fp : 'img/uk.png'
    res.render("skeleton.pug", { dishes: menuData, lg: lang, flagPath: fp, app_strings: appStrings })
  })
});

router.get('/pizzas', async (req, res) => {
  page = "PIZZAS"

  getMenuData("PIZZAS").then((menuData) => {
    let lang = req.query.language ? req.query.language : 'en'
    let fp = req.query.fp ? req.query.fp : 'img/uk.png'
    res.render("skeleton.pug", { dishes: menuData, lg: lang, flagPath: fp, app_strings: appStrings })
  })
});

router.get('/children', async (req, res) => {
  page = "CHILDREN"

  getMenuData("CHILDREN").then((menuData) => {
    let lang = req.query.language ? req.query.language : 'en'
    let fp = req.query.fp ? req.query.fp : 'img/uk.png'
    res.render("skeleton.pug", { dishes: menuData, lg: lang, flagPath: fp, app_strings: appStrings })
  })
});

router.get('/desserts', async (req, res) => {
  page = "DESSERTS"

  getMenuData("DESSERTS").then((menuData) => {
    let lang = req.query.language ? req.query.language : 'en'
    let fp = req.query.fp ? req.query.fp : 'img/uk.png'
    res.render("skeleton.pug", { dishes: menuData, lg: lang, flagPath: fp, app_strings: appStrings })
  })
});

app.use(express.static(path.join(__dirname, '/')), router)

app.listen(process.env.PORT, function () {
  console.log(`Web app listening on port ${process.env.PORT}`);
  getAppStrings().then((app_strings) => {
    appStrings = app_strings[0]
  })
});
