# Python Script that downloads pictures for each dish
# Using Google Images API

from imgScrapy.imgScrap import GoogleImgScrapy

DRIVER_PATH = './imgScrapy/webdriver/chromedriver.exe'
ROOT_IMG_PATH = 'C:/Users/josue/Documents/Programming/projects/WEB/La Cabaña Online Menu v2/public/img/dishes'


collections = {
    "main": ["main_starters", "main_pasta", "main_fish", "main_specialties", "main_beef", "main_chicken", "main_pork",
             "main_lamb"],
    "breakfast": ["breakfast", "breakfast_brunch", "breakfast_drinks"],
    "drinks": ["drinks_beer", "drinks_soda", "drinks_water", "drinks_coffee", "drinks_wine", "drinks_mix_local",
               "drinks_mix_imported", "drinks_spirits", "drinks_liqueur", "drinks_milkshakes"],
    "pasta": ["pasta", "pasta_other"],
    "spanish": ["spanish_starters", "spanish_tortilla", "spanish_paella"],
    "mexican": ["mexican"],
    "pizzas": ["pizza_classic", "pizza_special"],
    "children": ["children"],
    "desserts": ["dessert_ice_cream", "dessert_milkshakes", "dessert_warm"]
}


def getDishNum():
    with open("output/dishNames.txt", "r") as myfile:
        data = myfile.read().splitlines()
        print(len(data))


def getDishNames():

    names = []

    for value in collections.values():
        for section in value:
            with open("input/" + section + ".txt", "r") as f:
                data = f.read().splitlines()
                for entry in data:
                    name = entry.split(',')[0]
                    names.append(name)

    with open("output/dishNames.txt", "w") as f:

        for name in names:
            f.write(name + "\n")


def downloadImages():

    goog_scraper = GoogleImgScrapy(DRIVER_PATH)
    dishes_by_menu = {}

    for menu in collections:
        dish_list = []
        for section in collections[menu]:
            with open("input/" + section + ".txt", "r") as f:
                data = f.read().splitlines()
                for entry in data:
                    name = entry.split(',')[0]
                    dish_list.append(name)

        dishes_by_menu[menu] = dish_list

    for menu in dishes_by_menu.keys():
        queries = dishes_by_menu[menu]

        goog_scraper.scrape_images(queries, ROOT_IMG_PATH + '/' + menu, 1)


def downloadImagesBySection(menu_sel: str):

    goog_scraper = GoogleImgScrapy(DRIVER_PATH)
    dishes_by_menu = {}

    for menu in collections:
        dish_list = []
        for section in collections[menu]:
            with open("input/" + section + ".txt", "r") as f:
                data = f.read().splitlines()
                for entry in data:
                    name = entry.split(',')[0]
                    dish_list.append(name)

        dishes_by_menu[menu] = dish_list

    if menu_sel == "pizzas" or menu_sel == "desserts":
        queries = [dish + " " + menu_sel for dish in dishes_by_menu[menu_sel]]

    else:
        queries = dishes_by_menu[menu_sel]
    goog_scraper.scrape_images(queries, ROOT_IMG_PATH + '/' + menu_sel, 1)


def addImageLinks():
    dishes_by_menu = {}

    for menu in collections:
        dish_list = []
        for section in collections[menu]:
            with open("input/" + section + ".txt", "r") as f:
                data = f.read().splitlines()
                for entry in data:
                    name = entry.split(',')[0]
                    dish_list.append(name)

        dishes_by_menu[menu] = dish_list

    for menu in dishes_by_menu.keys():
        for section in collections[menu]:
            img_list = []
            new_data = ""
            with open("input/" + section + ".txt", "r") as fin:
                data = fin.read().splitlines()
                for entry in data:
                    img_name = "_".join(entry.split(',')[0].lower().split(' ')) + '.jpg'
                    img_list.append(img_name)
                    old_entry = entry
                    entry = entry.replace(old_entry,
                                          old_entry.rstrip("\n") + "," + f"img/dishes/{menu}/{img_name}" + "\n")
                    new_data += entry

            with open("input/" + section + ".txt", "w") as fout:
                fout.write(new_data)


def addImageLinksBySection(menu_sel: str, section_sel: str):
    dishes_by_menu = {}

    for menu in collections:
        dish_list = []
        for section in collections[menu]:
            with open("input/" + section + ".txt", "r") as f:
                data = f.read().splitlines()
                for entry in data:
                    name = entry.split(',')[0]
                    dish_list.append(name)

                f.close()

        dishes_by_menu[menu] = dish_list

    img_list = []
    new_data = ""
    with open("input/" + section_sel + ".txt", "r") as fin:
        data = fin.read().splitlines()
        for entry in data:
            img_name = "_".join(entry.split(',')[0].lower().split(' ')) + '.jpg'
            img_list.append(img_name)
            old_entry = entry
            entry = entry.replace(old_entry, old_entry.rstrip("\n") + "," + f"img/dishes/{menu_sel}/{img_name}" + "\n")
            new_data += entry

    with open("input/" + section_sel + ".txt", "w") as fout:
        fout.write(new_data)


if __name__ == "__main__":
    addImageLinks()
