# MongoDB Populate Database Script
# Coded by @josflesan (https://github.com/josflesan)

import pymongo
import json
from deep_translator import GoogleTranslator

collections = {
    "main": ["main_starters", "main_pasta", "main_fish", "main_specialties", "main_beef", "main_chicken", "main_pork",
             "main_lamb"],
    "breakfast": ["breakfast", "breakfast_brunch", "breakfast_drinks"],
    "drinks": ["drinks_beer", "drinks_soda", "drinks_water", "drinks_coffee", "drinks_mix_imported", "drinks_mix_local",
               "drinks_spirits", "drinks_liqueur", "drinks_milkshakes"],
    "pasta": ["pasta", "pasta_other"],
    "spanish": ["spanish_starters", "spanish_tortilla", "spanish_paella"],
    "mexican": ["mexican"],
    "pizzas": ["pizza_classic", "pizza_special"],
    "children": ["children"],
    "desserts": ["dessert_ice_cream", "dessert_milkshakes", "dessert_warm"]
}

section_titles = {
    "main_starters": "starters",
    "main_pasta": "pasta",
    "main_fish": "fish",
    "main_specialties": "specialties",
    "main_beef": "beef",
    "main_chicken": "chicken",
    "main_pork": "pork",
    "main_lamb": "lamb",

    "breakfast": "breakfast",
    "breakfast_brunch": "brunch",
    "breakfast_drinks": "drinks",

    "drinks_beer": "beer",
    "drinks_soda": "soda",
    "drinks_water": "water",
    "drinks_coffee": "coffee",
    "drinks_mix_imported": "imported mix",
    "drinks_mix_local": "local mix",
    "drinks_spirits": "spirits",
    "drinks_liqueur": "liqueurs",
    "drinks_milkshakes": "milkshakes",

    "pasta": "pasta",
    "pasta_other": "other",

    "spanish_starters": "starters",
    "spanish_tortilla": "omelette",
    "spanish_paella": "paella",

    "mexican": "mexican",

    "pizza_classic": "classic",
    "pizza_special": "special",

    "children": "children",

    "dessert_ice_cream": "ice cream",
    "dessert_milkshakes": "milkshakes",
    "dessert_warm": "warm",

}


def parseFile(file_path: str):
    dishes = {}

    with open(file_path, "r") as myfile:
        data = myfile.read().splitlines()

        for entry in data:
            data = entry.split(',')
            option_names = []
            option_prices = []

            extras = data[3].lstrip('[').rstrip(']').split('|')

            if extras != ['']:
                option_names = [option.split(':')[0] for option in extras] if ':' in extras[0] else [option for option in extras]
                option_prices = [option.split(':')[1] + " €" for option in extras] if ':' in extras[0] else []

            name = data[0]
            prices = [data[1] + " €"] + option_prices
            ingredients = data[2].lstrip('(').rstrip(')').split('/')
            labels = data[4].lstrip('[').rstrip(']').split('|')
            img_url = data[5]
            dishes[name] = [prices, ingredients, option_names, labels, img_url]

    return dishes


def parseReviewFile(file_path: str):
    reviews = {}

    with open(file_path, "r") as myfile:
        data = myfile.read().splitlines()

        for entry in data:
            data = entry.split('|')

            username = data[0]
            date = data[1]
            title = data[2]
            description = data[3]
            img_url = data[4]
            reviews[username] = [date, title, description, img_url]

    return reviews


def parseAppStringsFile(file_path: str):

    f = open(file_path,)
    app_strings = json.load(f)
    f.close()

    return app_strings


def translateBatch(texts):
    originLang = "en"
    destLangsDict = {"da": "Danish",
                     "nl": "Dutch",
                     "fi": "Finnish",
                     "fr": "French",
                     "de": "German",
                     "it": "Italian",
                     "no": "Norwegian",
                     "es": "Spanish",
                     "sv": "Swedish"}

    destLangCodes = destLangsDict.keys()

    translatedDict = {}

    for destLang in destLangCodes:
        result = GoogleTranslator(source=originLang, target=destLang).translate_batch(texts)
        translatedDict[destLangsDict[destLang]] = result

    return translatedDict


def translateOne(text):

    originLang = "en"
    destLangsDict = {"da": "Danish",
                     "nl": "Dutch",
                     "fi": "Finnish",
                     "fr": "French",
                     "de": "German",
                     "it": "Italian",
                     "no": "Norwegian",
                     "es": "Spanish",
                     "sv": "Swedish"}

    destLangCodes = destLangsDict.keys()

    translatedDict = {}

    for destLang in destLangCodes:
        result = GoogleTranslator(source=originLang, target=destLang).translate(text)
        translatedDict[destLangsDict[destLang]] = result

    return translatedDict


def populateMenuCollection(myDb, collection_name: str):
    col = myDb[collection_name]
    collData = parseFile(f"input/{collection_name}.txt")

    for dish in collData.keys():

        print(f"Ingredients: {collData[dish][1]}")
        print(f"Options: {collData[dish][2]}")

        dishNameTrans = translateOne(dish)
        ingredientTrans = translateBatch(collData[dish][1])

        if len(collData[dish][2]) != 0:
            optionTrans = translateBatch(collData[dish][2])
            optionsField = {
                "en": collData[dish][2],
                "es": optionTrans['Spanish'],
                "nw": optionTrans['Norwegian'],
                "de": optionTrans['German'],
                "sw": optionTrans['Swedish'],
                "fn": optionTrans['Finnish'],
                "dk": optionTrans['Danish'],
                "hl": optionTrans['Dutch'],
                "it": optionTrans['Italian'],
                "fr": optionTrans['French'],
            }
        else:
            optionsField = {
                "en": [],
                "es": [],
                "nw": [],
                "de": [],
                "sw": [],
                "fn": [],
                "dk": [],
                "hl": [],
                "it": [],
                "fr": [],
            }

        newItem = {
            "name": {
                "en": dish,
                "es": dishNameTrans['Spanish'],
                "nw": dishNameTrans['Norwegian'],
                "de": dishNameTrans['German'],
                "sw": dishNameTrans['Swedish'],
                "fn": dishNameTrans['Finnish'],
                "dk": dishNameTrans['Danish'],
                "hl": dishNameTrans['Dutch'],
                "it": dishNameTrans['Italian'],
                "fr": dishNameTrans['French'],
            },
            "prices": collData[dish][0],
            "ingredients": {
                "en": collData[dish][1],
                "es": ingredientTrans['Spanish'],
                "nw": ingredientTrans['Norwegian'],
                "de": ingredientTrans['German'],
                "sw": ingredientTrans['Swedish'],
                "fn": ingredientTrans['Finnish'],
                "dk": ingredientTrans['Danish'],
                "hl": ingredientTrans['Dutch'],
                "it": ingredientTrans['Italian'],
                "fr": ingredientTrans['French'],
            },
            "options": optionsField,
            "labels": collData[dish][3],
            "desc": {},
        }

        x = col.insert_one(newItem)
        print(x.inserted_id)


def populateReviewsCollection(myDb, collection_name: str):
    col = myDb[collection_name]
    collData = parseReviewFile(f"input/{collection_name}.txt")

    for user in collData.keys():

        print(f"Date: {collData[user][0]}")
        print(f"Title: {collData[user][1]}")

        reviewTitleTrans = translateOne(collData[user][1])
        descriptionTrans = translateOne(collData[user][2])

        newItem = {
            "username": user,
            "date": collData[user][0],
            "title": {
                "en": collData[user][1],
                "es": reviewTitleTrans['Spanish'],
                "nw": reviewTitleTrans['Norwegian'],
                "de": reviewTitleTrans['German'],
                "sw": reviewTitleTrans['Swedish'],
                "fn": reviewTitleTrans['Finnish'],
                "dk": reviewTitleTrans['Danish'],
                "hl": reviewTitleTrans['Dutch'],
                "it": reviewTitleTrans['Italian'],
                "fr": reviewTitleTrans['French'],
            },
            "description": {
                "en": collData[user][2],
                "es": descriptionTrans['Spanish'],
                "nw": descriptionTrans['Norwegian'],
                "de": descriptionTrans['German'],
                "sw": descriptionTrans['Swedish'],
                "fn": descriptionTrans['Finnish'],
                "dk": descriptionTrans['Danish'],
                "hl": descriptionTrans['Dutch'],
                "it": descriptionTrans['Italian'],
                "fr": descriptionTrans['French'],
            },
            "profile_pic": collData[user][3],
        }

        x = col.insert_one(newItem)
        print(x.inserted_id)


def populateAppStringsCollection(myDb, collection_name: str):
    col = myDb[collection_name]
    data = parseAppStringsFile(f"input/{collection_name}.json")

    record = {}

    for page, string_dict in data.items():
        print(f"{page}")
        for string_id, string in string_dict.items():
            stringTrans = translateOne(string)
            record[string_id] = {
                "en": string,
                "es": stringTrans['Spanish'],
                "nw": stringTrans['Norwegian'],
                "de": stringTrans['German'],
                "sw": stringTrans['Swedish'],
                "fn": stringTrans['Finnish'],
                "dk": stringTrans['Danish'],
                "hl": stringTrans['Dutch'],
                "it": stringTrans['Italian'],
                "fr": stringTrans['French'],
            }

    x = col.insert_one(record)
    print(x.inserted_id)


def addSectionTitles(myDb):

    for section in section_titles.keys():
        col = myDb[section]
        transTitles = translateOne(section_titles[section])

        data = {
            "section_title": {
                "en": section_titles[section],
                "es": transTitles['Spanish'],
                "nw": transTitles['Norwegian'],
                "de": transTitles['German'],
                "sw": transTitles['Swedish'],
                "fn": transTitles['Finnish'],
                "dk": transTitles['Danish'],
                "hl": transTitles['Dutch'],
                "it": transTitles['Italian'],
                "fr": transTitles['French'],
            }
        }

        x = col.insert_one(data)
        print(x.inserted_id)


def addPhotoUrls(myDb, collection_name: str):
    col = myDb[collection_name]
    collData = parseFile(f"input/{collection_name}.txt")

    for dish in collData.keys():
        dishImage = collData[dish][-1]
        myDb[collection_name].update_one({"name.en": dish}, {"$set": {"photo_url": dishImage}})


def main():

    myclient = pymongo.MongoClient('mongodb+srv://joflesan:anjomima0@lccluster.8z8vl.mongodb.net/lcOnlineMenu'
                                   '?retryWrites=true&w=majority')

    myDb = myclient["lcOnlineMenu"]  # Select database

    # for menu in collections.keys():
    #     for section in collections[menu]:
    #         populateCollection(myDb, section)
    #         time.sleep(5)

    # for menu in collections.keys():
    #     for section in collections[menu]:
    #         addPhotoUrls(myDb, section)
    #         time.sleep(2)

    # populateReviewsCollection(myDb, "reviews")
    populateAppStringsCollection(myDb, "app_strings")


if __name__ == '__main__':
    main()
