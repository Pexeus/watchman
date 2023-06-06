import { firefox } from "playwright"

let browser = false

async function init() {
    // Launch Firefox browser
    browser = await firefox.launch({ headless: false });
}

export async function getHLS(id) {
    const embed = `https://www.2embed.to/embed/imdb${id}`
    const t0 = Date.now()

    while (!browser) {
        await sleep(100)
    }

    // Create a new page
    const context = await browser.newContext();

    //store HLS url
    let hls = false

    context.on('page', async (page) => {
        if (page.url() != "about:blank" && page.url() != embed) {
            await page.close()
        }
    });

    const page = await context.newPage();

    // Navigate to a website
    const response = await page.goto(embed);
    console.log(response.status());

    if (response.status() != 200) {
        console.log('Not found', response.status());
        hls = {status: response.status()}
    }

    await page.route('**', route => {
        const url = route.request().url()

        if (url.includes(".m3u8")) {
            hls = url
        }

        route.continue()
    });

    // Navigate to website
    await page.goto(embed);

    const { width, height } = await page.evaluate(() => ({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
    }));

    // Calculate the coordinates of the center of the page
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);

    // Click on the center of the page
    while (!hls) {
        await page.mouse.click(centerX, centerY);
    }

    await context.close()

    console.log(`hls link ready in ${Date.now() - t0}ms`);

    return hls
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const embed = {
    init: init,
    hls: getHLS
}

export default embed