from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import re
import time as time_module

def scrape_event_details(driver, event_url):
    driver.get(event_url)
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "h1")))

    name = "N/A"
    try:
        name_element = driver.find_element(By.TAG_NAME, "h1")
        name = name_element.text.strip()
    except:
        pass

    date = "N/A"
    event_time = "N/A"
    try:
        date_time_element = driver.find_element(By.XPATH, "//a[contains(text(), 'sábado') or contains(text(), 'domingo') or contains(text(), 'segunda') or contains(text(), 'terça') or contains(text(), 'quarta') or contains(text(), 'quinta') or contains(text(), 'sexta')]")
        date_time_text = date_time_element.text.strip()
        match = re.search(r'(.*) de (\d{2}:\d{2}) a (\d{2}:\d{2})', date_time_text)
        if match:
            date = match.group(1).strip()
            event_time = f'{match.group(2)} a {match.group(3)}'
        else:
            date = date_time_text
    except Exception as e:
        print(f"Erro ao extrair data/hora: {e}")
        pass

    location = "N/A"
    try:
        location_element = driver.find_element(By.XPATH, "//a[contains(@href, 'google.com/maps/search/')]")
        location = location_element.text.strip()
    except:
        pass

    description = "N/A"
    try:
        description_header = driver.find_element(By.XPATH, "//h2[text()=\'Descrição\']")
        description_element = description_header.find_element(By.XPATH, "./following-sibling::div")
        description = description_element.text.strip()
    except:
        pass

    image_url = "N/A"
    try:
        image_element = driver.find_element(By.CSS_SELECTOR, "img.w-full.h-full.object-cover")
        image_url = image_element.get_attribute("src")
    except:
        pass

    category = "N/A"
    try:
        category_elements = driver.find_elements(By.CSS_SELECTOR, "span.text-gray-500.text-xs")
        categories = [cat.text.strip() for cat in category_elements]
        category = ", ".join(categories)
    except:
        pass

    event_link = event_url

    return {
        'nome': name,
        'data': date,
        'horario': event_time,
        'local': location,
        'descricao': description,
        'url_imagem': image_url,
        'categoria': category,
        'link_evento': event_link
    }

def main():
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome(service=Service(), options=chrome_options)

    base_url = 'https://shotgun.live/pt-br/cities/fortaleza'
    driver.get(base_url)
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "a[href*='/events/']")))

    event_links = []
    links = driver.find_elements(By.CSS_SELECTOR, "a[href*='/events/']")
    for link in links:
        full_link = link.get_attribute('href')
        if full_link not in event_links:
            event_links.append(full_link)

    all_events_data = []
    for link in event_links:
        print(f'Scraping: {link}')
        event_data = scrape_event_details(driver, link)
        all_events_data.append(event_data)

    with open('events.json', 'w', encoding='utf-8') as f:
        json.dump(all_events_data, f, ensure_ascii=False, indent=4)

    print('Dados dos eventos salvos em events.json')
    driver.quit()

if __name__ == '__main__':
    main()

