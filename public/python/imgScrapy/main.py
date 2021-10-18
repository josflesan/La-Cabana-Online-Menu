"""
Main Program to run image scraper on Google Images
Implementation based on tutorial @ https://rubikscode.net/2021/06/21/scraping-images-with-python/

@author josflesan (github.com/josflesan)
"""

from imgScrap import GoogleImgScrapy

DRIVER_PATH = './webdriver/chromedriver.exe'
IMG_PATH = 'C:/Users/josue/Documents/Programming/projects/imgScrapy/img'
QUERIES = ['kanye']
IMAGES_PER_QUERY = 15  # Maximum of 15 images per query for optimum performance


def main():
    goog_scraper = GoogleImgScrapy(DRIVER_PATH)
    goog_scraper.scrape_images(QUERIES, 'C:/Users/josue/Documents/Programming/projects/imgScrapy/img', IMAGES_PER_QUERY)


if __name__ == "__main__":
    main()
