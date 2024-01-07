import { firefox } from "playwright"

let browser
let abort
let hls

export async function initiateBrowser() {
    browser = await firefox.launch({ headless: true });
}

export async function getHLS(embed) {
    abort = false
    hls = false
    
    const context = await browser.newContext();
    const page = await context.newPage();

    setTimeout(async () => {
        if (!hls) {
            console.log('timeout exceeded. defaulting to false.');

            abort = true
            await context.close()

            return false
        }
    }, 500000);

    context.on('page', async (page) => {
        if (page.url() != "about:blank" && page.url() != embed) {
            await page.close()
        }
    });

    await page.route('**', route => {
        const url = route.request().url()

        if (url.includes(".m3u8")) {
            hls = url
        }

        route.continue()
    });

    const res = await page.goto(embed)

    if (res.status() != 200) {
        abort = true;
    }

    await clickPlay(page)
    await context.close()

    return hls
}

async function clickPlay(page) {
    const { width, height } = await page.evaluate(() => ({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
    }));

    // Calculate the coordinates of the center of the page
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);

    // Click on the center of the page
    while (!hls && !abort) {
        try {
            await page.mouse.click(centerX, centerY);
        }
        catch {}
    }
}

async function debug() {
    await initiateBrowser()

    const hls = await getHLS("https://vidsrc.to/embed/tv/tt4158110")
    console.log(hls);
}