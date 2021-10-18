# -*- coding: utf-8 -*-
"""
Google Image Python Scraper

@author: josflesan (github.com/josflesan)
"""


from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException

# helper libraries
import time
import io
from urllib import request
import os
import requests
from PIL import Image


class GoogleImgScrapy:
    """
    Downloads images from google based on search term.
    driver - Selenium webdriver
    """

    def __init__(self, driver_path):
        """
        Constructor method, initialises chrome webdriver
        :param driver_path: the path to the chrome webdriver, specified in the DRIVER_PATH variable in main.py
        """
        self.driver = webdriver.Chrome(executable_path=driver_path)
        pass

    def _scroll_to_end(self):
        """
        Function that scrolls to the end of the page so as to load all images
        """
        self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(1)

    def _build_query(self, query: str):
        """
        Method that builds url from query
        :param query: the search terms used for the query
        :return: url string for google image search
        """
        return f"https://www.google.com/search?safe=off&site=&tbm=isch&source=hp&q={query}&oq={query}&gs_l=img"

    def _get_info(self, query: str, num_images: int):
        """
        Method that obtains a list of image urls for a particular search query
        :param query: the search term used in the query
        :param num_images: the number of images downloaded for this search term
        :return: list of image urls to be downloaded for this search term
        """
        image_urls = []

        self.driver.get(self._build_query(query))
        self._scroll_to_end()

        # img.Q4LuWd is google's thumbnail selector
        thumbnails = self.driver.find_elements_by_css_selector("img.Q4LuWd")

        print(f"Getting the links...")

        for thumbnail in thumbnails[0:num_images]:
            try:
                thumbnail.click()  # Click on the first image

                image = self.driver.find_element_by_class_name('n3VNCb')  # Select image pop up
                time.sleep(0.3)

                if image.get_attribute('src') and 'http' in image.get_attribute('src')[:4].lower():
                    image_urls.append([image.get_attribute('src'), False])
                else:
                    # Image src is a URI
                    data_uri = image.get_attribute('src')
                    with request.urlopen(data_uri) as response:
                        data = response.read()

                    image_urls.append([data, True])

            except NoSuchElementException:
                print('ERROR: Cannot click on image')

        return image_urls

    def download_image(self, query: str, folder_path: str, url: list):
        """
        Method that downloads a single image and saves it to the folder path with the search term
        as its name
        :param query: the search term used to obtain image and to save it to the file system
        :param folder_path: the string representation of the absolute path the image is to be saved to
        :param url: string url representation of image to be downloaded
        """

        if not url[1]:

            try:
                image_content = requests.get(url[0]).content

            except Exception as e:
                print(f"ERROR: Could not download {url} - {e}")

            try:
                image_file = io.BytesIO(image_content)
                image = Image.open(image_file).convert('RGB')
                file = os.path.join(folder_path, '_'.join(query.lower().split(' ')) + '.jpg')

                with open(file, 'wb') as f:
                    image.save(f, "JPEG", quality=85)
                time.sleep(0.3)
                print(f"SUCCESS: saved {url[0]} - as {file}")

            except Exception as e:
                print(f"ERROR: Could not save {url[0]} - {e}")

        else:

            with open(os.path.join(folder_path, '_'.join(query.lower().split(' ')) + '.jpg'), "wb") as f:
                f.write(url[0])

    def scrape_images(self, queryList: list, folder_path: str, num_images: int):
        """
        Method that scrapes and downloads images

        :param queryList: list of search terms to be used
        :param folder_path: absolute path where images will be saved to
        :param num_images: number of images to be downloaded per query
        """
        folder = os.path.abspath(folder_path)
        image_urls = {}
        queryPos = 0

        if not os.path.exists(folder):
            os.makedirs(folder)

        for query in queryList:
            image_urls[query] = self._get_info(query, num_images)

        print(f"Downloading images...")
        print(image_urls)

        for query in image_urls.keys():
            queryPos = 0
            for url in image_urls[query]:
                if num_images > 1:
                    self.download_image(query + str(queryPos), folder, url)
                    queryPos += 1
                else:
                    self.download_image(query, folder, url)
