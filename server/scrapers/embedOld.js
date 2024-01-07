import { firefox } from "playwright"

let browser = false

async function init() {
    // Launch Firefox browser
    browser = await firefox.launch({ headless: false });
}

export async function getHLS(embed) {
    return new Promise(async resolve => {
        try {
            const t0 = Date.now()

            let hls = false
            let abort = false

            while (!browser) {
                await sleep(100)
            }

            setTimeout(async () => {
                if (!hls) {
                    console.log('timeout exceeded. defaulting to false.');

                    abort = true
                    await context.close()

                    resolve(false)
                }
            }, 500000);

            // Create a new page
            const context = await browser.newContext();

            context.on('page', async (page) => {
                if (page.url() != "about:blank" && page.url() != embed) {
                    await page.close()
                }
            });

            const page = await context.newPage();

            page.on('console', (message) => {
                console.log(`[Console ${message.type().toUpperCase()}] ${message.text()}`);
            });

            await page.route('**', route => {
                const url = route.request().url()


                if (url.includes(".m3u8")) {
                    console.log(url);
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
            while (!hls && !abort) {
                try {
                    //await page.mouse.click(centerX, centerY);
                }
                catch {

                }
            }

            if (!abort) {
                //await context.close()

                console.log(`hls link ready in ${Date.now() - t0}ms`);

                resolve(hls)
            }
        }
        catch(err) {
            console.log(err);

            resolve(false)
        }
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function debug() {
    await init()
    const src = await getHLS('https://vidsrc.to/embed/tv/tt4158110')

    console.log(src);
}

debug()



const embed = {
    init: init,
    hls: getHLS
}

export default embed