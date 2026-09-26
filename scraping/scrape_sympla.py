import json
import logging
from time import sleep
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class SymplaScraper:
    def __init__(self, city: str, categorias: list, headless: bool = True):
        self.city = city
        self.categorias = categorias
        self.driver = self._init_driver(headless)
        self.wait = WebDriverWait(self.driver, 30)
        self.base_url = f"https://www.sympla.com.br/eventos?s={city}"
        self.results = []
        self.failures = []

    def _init_driver(self, headless: bool):
        options = Options()
        if headless:
            options.add_argument('--headless')
        options.add_argument('--start-maximized')
        return webdriver.Chrome(options=options)

    def _click_if_exists(self, xpath):
        try:
            btn = self.wait.until(EC.element_to_be_clickable((By.XPATH, xpath)))
            btn.click()
        except Exception as e:
            logging.warning(f"Botão não encontrado ou clicável: {xpath} -> {e}")

    def open_site(self):
        self.driver.get(self.base_url)
        self._click_if_exists("//*[@id='onetrust-close-btn-container']/button")
        sleep(5)

        try:
            self.wait.until(EC.frame_to_be_available_and_switch_to_it((By.XPATH, "//*[@id='intercom-container']/div/iframe")))
            self._click_if_exists("//*[@id='intercom-container']/div/div/div/div[1]")
            self.driver.switch_to.default_content()
        except:
            self.driver.switch_to.default_content()

    def aplicar_filtro_categoria(self, categoria):
        self._click_if_exists("//button[contains(., 'Categoria')]")
        sleep(1)
        self._click_if_exists(f"//div[contains(text(), '{categoria}')]")
        sleep(5)

    def coletar_links(self):
        all_links = set()
        while True:
            try:
                self.wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'a.sympla-card')))
                links = [e.get_attribute('href') for e in self.driver.find_elements(By.CSS_SELECTOR, 'a.sympla-card')]
                all_links.update(links)
                logging.info(f"{len(all_links)} links coletados até agora.")
                btn = self.driver.find_element(By.XPATH, "//button[.//div[text()='Próximo']]")
                ActionChains(self.driver).move_to_element(btn).click().perform()
                sleep(5)
            except:
                break
        return list(all_links)

    def coletar_dados_evento(self, link: str, categoria: str):
        self.driver.get(link)
        sleep(5)
        try:
            section_xpath = "//*[@id='event-page-top']/section"
            section = self.wait.until(EC.visibility_of_element_located((By.XPATH, section_xpath)))
            title = section.find_element(By.TAG_NAME, "h1").text.strip()
            date = section.find_element(By.XPATH, "//*[@id='event-page-top']/section/div/div/div[1]" ).text.strip()
            location = section.find_element(By.XPATH, "//*[@id='event-page-top']/section/div/div/div[2]/div" ).text.strip()

            self._click_if_exists("//*[@id='event-page-top']/div/button")
            img = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#modalContainer img")))
            img_url = img.get_attribute("src")
            exit_img = section.find_element(By.XPATH, "//*[@id='modalContainer']/div/div/div[1]/p/button").click()

            section_desc = self.wait.until(EC.visibility_of_element_located((By.XPATH, "//*[@id='__next']/section[3]")))
            desc = section_desc.find_element(By.XPATH, "//*[@id='__next']/section[3]/div/div/div[1]").text.strip()

            return {
                "link": link,
                "title": title,
                "date": date,
                "location": location,
                "img_url": img_url,
                "categoria": categoria,
                "description": desc
            }
        except:
            try:
                section_xpath = "//*[@id='__next']/section[2]"
                section = self.wait.until(EC.visibility_of_element_located((By.XPATH, section_xpath)))
                title = section.find_element(By.TAG_NAME, "h1").text.strip()
                date = section.find_element(By.XPATH, "//*[@id='event-page-top']/section/div/div/div[1]" ).text.strip()
                location = section.find_element(By.XPATH, "//*[@id='event-page-top']/section/div/div/div[2]/div" ).text.strip()

                self._click_if_exists("//*[@id='event-page-top']/div/button")
                img = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#modalContainer img")))
                img_url = img.get_attribute("src")
                exit_img = section.find_element(By.XPATH, "//*[@id='modalContainer']/div/div/div[1]/p/button").click()

                section_desc = self.wait.until(EC.visibility_of_element_located(By.XPATH, "//*[@id='__next']/section[3]"))
                desc = section_desc.find_element(By.XPATH, "//*[@id='__next']/section[3]/div/div/div[1]").text.strip()

                return {
                    "link": link,
                    "title": title,
                    "date": date,
                    "location": location,
                    "img_url": img_url,
                    "categoria": categoria,
                    "description": desc
                }
            except Exception as e:
                logging.error(f"Erro ao coletar dados de {link}: {e}")
                self.failures.append(link)
                return None

    def extrair_eventos(self, links, categoria):
        for link in links:
            logging.info(f"Extraindo: {link}")
            data = self.coletar_dados_evento(link, categoria)
            if data:
                self.results.append(data)

    def salvar_em_json(self, path='eventos.json'):
        with open(path, 'w', encoding='utf-8') as f:
            json.dump({"events": self.results, "failures": self.failures}, f, ensure_ascii=False, indent=2)
        logging.info(f"Salvo em {path} ({len(self.results)} eventos | {len(self.failures)} falhas)")

    def fechar(self):
        self.driver.quit()

    def executar(self):
        try:
            for categoria in self.categorias:
                logging.info(f"\n========== Coletando categoria: {categoria} ==========")
                self.open_site()
                self.aplicar_filtro_categoria(categoria)
                links = self.coletar_links()
                self.extrair_eventos(links, categoria)
        finally:
            self.salvar_em_json()
            self.fechar()


if __name__ == '__main__':
    categorias = [
        "Festas e shows", "Cursos e Workshops", "Saúde e Bem-Estar", "Infantil",
        "Religião e Espiritualidade", "Esportes", "Games e Geek", "Gastronomia",
        "Moda e Beleza", "Arte, Cinema e Lazer", "Pride"
    ]
    scraper = SymplaScraper(city="Fortaleza", categorias=categorias, headless=False)
    scraper.executar()
