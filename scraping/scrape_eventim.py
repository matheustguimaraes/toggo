from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import json
from datetime import datetime
import time
import os


def scrape_eventim():
    url = "https://www.eventim.com.br/city/sao-paulo-943/"

    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
    
    chrome_options.add_experimental_option("prefs", {
        "profile.default_content_setting_values.cookies": 1
    })


    service = Service()
    driver = webdriver.Chrome(service=service, options=chrome_options)

    driver.get(url)
    time.sleep(5)

    soup = BeautifulSoup(driver.page_source, "html.parser")
    driver.quit()

    events = []
    
    cluster_section = soup.find("section", {"data-c": "clusterpagewidget"})

    
    script_tag = soup.find('script', {'id': 'eventMarkup'})

    json_data_string = script_tag.string

    data = json.loads(json_data_string)

    item_list = data['itemListElement']

    for element in item_list:
        if 'item' in element:
            item = element['item']
            location = item['location']
            offers = item['offers']
            print(f"Evento: {item['name']}, Data: {item['startDate']}, Local: {location['name']}, URL: {offers['url']}")
    

if __name__ == "__main__":
    data = scrape_eventim()
