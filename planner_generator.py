import asyncio
import calendar
import locale
import os
from datetime import timedelta
from os.path import abspath

from jinja2 import Environment, FileSystemLoader, ext
from playwright.async_api import async_playwright


class PlannerBuilder:
    def __init__(self, year: int, is_theme_dark: bool, templates_path: str):
        self.year: int = year
        self.is_theme_dark: bool = is_theme_dark
        self.pages: dict[str, str] = dict()
        self.j2_env = Environment(
            loader=FileSystemLoader(os.path.join(os.path.dirname(__file__), templates_path)),
            autoescape=True,
            enable_async=True,
            extensions=[ext.loopcontrols],
        )

    async def build_planner(self) -> str:
        return await self.j2_env.get_template("full_planner.html").render_async(
            is_theme_dark=self.is_theme_dark, pages=self.pages.values()
        )

    async def add_pages(self):
        # locale.setlocale(locale.LC_ALL, 'ru_RU.UTF-8')
        for template_name in ["cover", "annual_overview", "monthly", "weekly", "daily", "inbox", "projects", "habits"]:
            template = self.j2_env.get_template(f"{template_name}.html")
            pages = await template.render_async(year=self.year, calendar=calendar, timedelta=timedelta)
            self.pages.update({template_name: pages})


async def generate_html(planner_html: str, out_file: str):
    with open(out_file, "w") as file:
        file.write(planner_html)


async def generate_pdf(html_file_path: str, css_file_path: str, out_file_path: str):
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch()
        page = await browser.new_page()
        await page.goto(f"file://{abspath(html_file_path)}")
        await page.add_style_tag(path=abspath(css_file_path))
        await page.pdf(path=abspath(out_file_path), width="11.7in", height="8.27in", print_background=True)
        await browser.close()


async def main():
    builder = PlannerBuilder(year=2025, is_theme_dark=True, templates_path="src/templates")
    await builder.add_pages()

    planner = await builder.build_planner()

    os.chdir(os.path.join(os.path.dirname(__file__)))
    await generate_html(planner, "./dist/index.html")
    await generate_pdf("./dist/index.html", "./dist/main.css", "planners/planner-2025-dark.pdf")


if __name__ == "__main__":
    asyncio.run(main())
