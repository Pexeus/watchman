export function waitForElement(selector) {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval); // Stop checking
                resolve(element); // Resolve the promise with the found element
            }
        }, 100); // Check every 100 milliseconds
    });
}