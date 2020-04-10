const puppeteer = require('puppeteer');
const logindetails = require('./logindetails');

const myDate = process.argv[2];
console.log(myDate);

(async () => {
  const browser = await puppeteer.launch({
    // headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  
  Object.assign(global, {browser, page});
  
  await page.goto('https://barbora.lt'); // wait until page load
  
  await Promise.all([
    page.click('#counties-data > div:nth-child(2) > div'),
  ]);

  await Promise.all([
    page.click('#counties-data > div:nth-child(1) > div > button'),
    page.waitForNavigation({waitUntil: 'networkidle2'})
  ]);

  await Promise.all([
    page.click('.b-header--links--login'),
  ]);

  const pages = await browser.pages(); // get all open pages by the browser
  const popup = pages[pages.length - 1]; // the popup should be the last page opened
  const available = [];

  await popup.type('#b-login-email', logindetails.USERNAME);
  await popup.type('#b-login-password', logindetails.PASSWORD);



  await Promise.all([
            popup.click('.b-login-form--login-button'),
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
  ]);

  await page.goto('https://barbora.lt/krepselis');


  page.on('response', async (response) => {
    if (response.url() === 'https://barbora.lt/api/eshop/v1/cart/deliveries') {
        const res = await response.json();
        const deliveries = (res.deliveries)[0].params.matrix.filter(day => day.id == myDate);
        if (deliveries.length) {
          deliveries.hours.forEach(time => time.available ? available.push(time) : '');          
          if (available.length) {
            await page.screenshot({ path: './screenshots/screenshot.png' });
            await Promise.all([
              page.click('.b-deliverytime--slot-available'),
            ]);
          }
        }
        console.log('Available deliveries: ' + available.length)
    }
  });
  
  while (!available.length) {
	  console.log(new Date() + ' checking site...')
      await page.reload()
      await page.waitFor(300000)
}
  



 
})();

