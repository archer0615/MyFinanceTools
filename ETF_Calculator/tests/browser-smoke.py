from pathlib import Path
from playwright.sync_api import sync_playwright


def main():
    page_path = Path("frontend/index.html").resolve()
    errors = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page()
        page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto(page_path.as_uri())
        page.click("#runMonteCarlo")
        page.wait_for_function(
            'document.querySelector("#workerStatus").textContent === "模擬完成"',
            timeout=10000,
        )

        assert page.locator("#chartCanvas").evaluate("canvas => canvas.width > 0 && canvas.height > 0")
        assert page.locator("#historicalYears").inner_text() == "2000-2023"
        assert page.locator("#workerStatus").inner_text() == "模擬完成"
        assert page.locator("#progress").evaluate("element => element.value") == 100
        assert not errors
        browser.close()


if __name__ == "__main__":
    main()
