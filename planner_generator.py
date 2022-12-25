import asyncio
import calendar
import locale
import os
from os.path import abspath

from jinja2 import Environment, FileSystemLoader
from playwright.async_api import async_playwright


class PlannerBuilder:
    def __init__(self, year: int, templates_path: str):
        self.year: int = year
        self.pages: dict[str, str] = dict()
        self.j2_env = Environment(loader=FileSystemLoader(os.path.join(os.path.dirname(__file__), templates_path)),
                                  autoescape=True,
                                  enable_async=True)

    async def build_planner(self) -> str:
        return await self.j2_env.get_template('full_planner.html').render_async(pages=self.pages.values())

    async def build_annual_pages(self):
        annual_template = self.j2_env.get_template('annual_overview.html')
        # locale.setlocale(locale.LC_ALL, 'ru_RU.UTF-8')
        page = await annual_template.render_async(year=self.year, calendar=calendar, id=self.year)
        self.pages.update({'year': page})

    async def build_monthly_pages(self):
        monthly_template = self.j2_env.get_template('monthly.html')
        pages = await monthly_template.render_async(year=self.year, calendar=calendar)
        self.pages.update({'months': pages})


async def generate_html(planner_html: str, out_file: str):
    with open(out_file, 'w') as file:
        file.write(planner_html)


async def generate_pdf(html_file_path: str, css_file_path: str, out_file_path: str):
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch()
        page = await browser.new_page()
        await page.goto(f"file://{abspath(html_file_path)}")
        await page.add_style_tag(path=abspath(css_file_path))
        await page.pdf(path=abspath(out_file_path), width='18.83in', height='11.77in', print_background=True)
        await browser.close()


async def main():
    builder = PlannerBuilder(year=2023, templates_path='src/templates')
    await builder.build_annual_pages()
    await builder.build_monthly_pages()

    planner = await builder.build_planner()

    os.chdir(os.path.join(os.path.dirname(__file__)))
    await generate_html(planner, './dest/index.html')
    await generate_pdf('./dest/index.html', './dest/main.css', './dest/planner.pdf')


if __name__ == "__main__":
    asyncio.run(main())
