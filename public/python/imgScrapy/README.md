# imgScrapy
> Google Image Scraper using Python and Selenium

## Table of Contents
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Setup](#setup)
* [Usage](#usage)
* [Project Status](#project-status)
* [Room for Improvement](#room-for-improvement)
* [Acknowledgements](#acknowledgements)


## General Information
- Python scraper that obtains image urls from google image search and downloads them to the user's computer. Coded to automate database population for other project


## Technologies Used
- selenium - version 3.141.0


## Features
List the ready features here:
- Awesome feature 1
- Awesome feature 2
- Awesome feature 3


## Setup

1. `pip install selenium`
2. Install Google Chrome and corresponding ChromeDriver: https://chromedriver.chromium.org/downloads


## Usage
1. Update `DRIVER_PATH` variable in main.py with chromedriver path
2. Update save location using `IMG_PATH` variable in main.py
3. Add/Change queries to `QUERIES` variable in main.py
4. Specify number of images to be downloaded per query using `IMAGES_PER_QUERY`
5. Run program and download your images!


## Project Status
Project is: _complete_ but might be revisited in the future


## Room for Improvement
- Add methods to class to make it more versatile


## Acknowledgements
- This project was based on [this tutorial](https://rubikscode.net/2021/06/21/scraping-images-with-python/).
