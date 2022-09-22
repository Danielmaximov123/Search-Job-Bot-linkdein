const puppeteer = require("puppeteer-extra");
const axios = require("axios");

const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

exports.scrapeJobs = () => {
  return new Promise(async (resolve, reject) => {
    const width = 1024;
    const height = 1600;

    const browser = await puppeteer.launch({
      headless: true,
      slowMo: 50,
      defaultViewport : { 'width' : width, 'height' : height },
      waitUntil: ["networkidle2"],
      // args: [`--proxy-server=http://p.webshare.io:80`, "--no-sandbox"],
      
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout( 90000 )
    await page.setViewport( { 'width' : width, 'height' : height } )
    // await page.authenticate({
    //   username: "yssyzsxj-rotate",
    //   password: "9x1y2eu9ees9",
    // });
    await page.setCookie({
      name: "li_at",
      value:
        "AQEIACMHLvuPQANhymUAAAGDVwWcigAAAYN7FJBuTQAAAAAAAAAAADBFAiEAq3IZXy5QjcZSVnldGQCFDMzMbBNYfyFs_9PS29qY5-MCIAZklhfs7nK-X2Nfl5ssA99mxSm5qUcPDSU1OCPGm4GC1RLUZhQAONQnWL06loxHLIiILZU",
      domain: "www.linkedin.com",
    });
    let url =
      "https://www.linkedin.com/jobs/search/?currentJobId=3273202253&f_AL=true&f_EA=true&f_TPR=r86400&geoId=101620260&keywords=full%20stack%20developer&location=Israel&refresh=true&sortBy=R";
    await page.goto(url, { waitUntil: "networkidle2" });
    await page.setUserAgent(
      "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36"
    );

    await page.waitForSelector('#main')

    // Results
    let result = await page.$eval(
      "small.display-flex.t-12.t-black--light.t-normal.jobs-search-results-list__text",
      (res) => Number(res.textContent.trim().replace(/\D/g, ""))
    );
    console.log(`There are ${result} jobs`);

    let ids = [];

    const jobsClick = await page.$$(".jobs-search-results__list-item");
    for (const obj in jobsClick) {
      const element = jobsClick[obj];
      await element.click();
      let data = await element.evaluate((el) =>
        el?.querySelector("a")?.getAttribute("href")
      );
      let id = await data?.split("/")?.[3];
      ids.push(id);
    }

  let allId = ids.filter((item) => item !== undefined);
  
  await browser.close()
  resolve(allId);
  });
};

exports.scrapeJob = (id, i , len) => {
  return new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch({
      headless: true,
      slowMo: 50,
      waitUntil : 'networkidle2',
      args: [`--proxy-server=149.14.243.178:80`],
      
    });

    const page = await browser.newPage();
    await page.authenticate({
      username: "yssyzsxj-rotate",
      password: "9x1y2eu9ees9",
    });

    await page.setCookie({
      name: "li_at",
      value:
        "AQEIACMHLvuPQANhymUAAAGDVwWcigAAAYN7FJBuTQAAAAAAAAAAADBFAiEAq3IZXy5QjcZSVnldGQCFDMzMbBNYfyFs_9PS29qY5-MCIAZklhfs7nK-X2Nfl5ssA99mxSm5qUcPDSU1OCPGm4GC1RLUZhQAONQnWL06loxHLIiILZU",
      domain: "www.linkedin.com",
    });
    let url = `https://www.linkedin.com/jobs/view/${id}`;
    await page.goto(url, { waitUntil: "networkidle2" });
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3683.103 Safari/537.36'
    );
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
    });
    console.log(`Start Scanning ${i}/${len}`);
    // Job
      await page.waitForSelector(".jobs-details" , { timeout : 15000 })
    let pageSelector = await page.$(".jobs-unified-top-card");
    if (!pageSelector) {
      await browser.close();
    } else {
      let titleSelector = await page.waitForSelector(
        ".jobs-unified-top-card__job-title"
      );
      let title = await page.evaluate(
        (e) => e?.textContent?.trim(),
        titleSelector
      );
      console.log('Get Title' , title);
      let companySelector = await page.waitForSelector(
        "span.jobs-unified-top-card__subtitle-primary-grouping.t-black > span.jobs-unified-top-card__company-name"
        );
        let company = await page.evaluate(
          (e) => e?.textContent?.trim(),
          companySelector
          );
        console.log('Get Company - ' , company);
      let areaSelector = await page.waitForSelector(
        " span.jobs-unified-top-card__subtitle-primary-grouping.t-black > span.jobs-unified-top-card__bullet"
      );
      let area = await page.evaluate(
        (e) => e?.textContent?.trim(),
        areaSelector
      );
      console.log('Get Area - ' , area);
      let jobPostDateSelector = await page.waitForSelector(
        " span.jobs-unified-top-card__subtitle-secondary-grouping.t-black--light > span.jobs-unified-top-card__posted-date"
      );
      let jobPostDate = await page.evaluate(
        (e) => e?.textContent?.trim(),
        jobPostDateSelector
      );
      console.log('Get Date - ' , jobPostDate);
      let waitForJobAbout = await page.waitForSelector(
        ".mt5.jobs-box__html-content.t-14"
      );
      let about = await page.evaluate(
        (e) => e?.textContent?.trim(),
        waitForJobAbout
      );
      console.log('Get About');
      let applyExist = null;
      let waitApply = await page
        .waitForSelector(
          "button.jobs-apply-button.artdeco-button.artdeco-button--3.artdeco-button--primary.ember-view",
          { timeout: 5000 }
        )
        .catch(() => {});
      if (!waitApply) {
        applyExist = false;
      } else {
        applyExist = true;
      }

      await browser.close();
      console.log(`End scan ${i}/${len}`)
      resolve({ title, company, area, jobPostDate, about, applyExist, id });
    }
  });
};

exports.filterJobs = (getJobsData , len) => {
  return new Promise(async (resolve) => {
    console.log(`Filtering begins ${getJobsData.length}`)
    let applyJobsExist = await getJobsData?.filter((item) =>
      item.applyExist ? item : !item
    );
    let title = await applyJobsExist?.filter((item) => {
      const senior = /senior.*/i;
      const ios = /ios.*/i;
      const android = /android.*/i;
      return senior.test(item.title) || ios.test(item.title) || android.test(item.title) ? !item : item
    });

    let titleNot = await title?.filter((dev) => {
      const developer = /developer.*/i;
      const full = /full.*/i;
      const stack = /stack.*/i;
      return full.test(dev.title) && stack.test(dev.title) || full.test(dev.title) && stack.test(dev.title) && developer.test(dev.title) || developer.test(dev.title)
    })
    let cityFilter = await titleNot?.filter((dev) => {
      const rishon = /rishon.*/i;
      const lod = /lod.*/i;
      const airportCity = /airport city.*/i;
      const beersheba = /beersheba.*/i;
      const ashdod = /ashdod.*/i;
      const jerusalem = /jerusalem.*/i;
      const nesZiyyona = /ziyyona.*/i;
      return rishon.test(dev.area) || ashdod.test(dev.area) || beersheba.test(dev.area) || jerusalem.test(dev.area) || nesZiyyona.test(dev.area) || airportCity.test(dev.area) || lod.test(dev.area) ? !dev : dev
    })

    
    let backFilter = cityFilter?.filter((dev) => {
      const beck = /back.*/i;
      const node = /node.*/i;
      return beck.test(dev.title) && !node.test(dev.about) ? !dev : dev
    })

    let frontFilter = backFilter?.filter((dev) => {
      const front = /front.*/i;
      const react = /react.*/i;
      return front.test(dev.title) && !react.test(dev.about) ? !dev : dev
    })

  const yearsExperience = frontFilter.filter((dev) => {
    const regex2 = /(^2|[^\d]+2)[^\d]+years.*/i 
    const regex3 = /(^3|[^\d]+3)[^\d]+years.*/i 
    const regex4 = /(^4|[^\d]+4)[^\d]+years.*/i 
    const regex5 = /(^5|[^\d]+5)[^\d]+years.*/i 
    const regex6 = /(^6|[^\d]+6)[^\d]+years.*/i 
    const regex7 = /(^7|[^\d]+7)[^\d]+years.*/i 
    return regex2.test(dev.about) || regex3.test(dev.about) || regex4.test(dev.about) || regex5.test(dev.about) || regex6.test(dev.about) || regex7.test(dev.about) ? !dev : dev
  })

        let aboutSkills = yearsExperience?.filter((dev) => {
          const full = /full.*/i;
          const stack = /stack.*/i;
          const react = /react.*/i;
          if(!full.test(dev.title) && !stack.test(dev.title)) {
            return dev
          }
          else if (full.test(dev.title) && stack.test(dev.title) && react.test(dev.about)) {
            return dev
          } else if (full.test(dev.title) && stack.test(dev.title) && !react.test(dev.about)) {
            return !dev
          }
        })

        
        let data = aboutSkills

  let date = new Date
  let dateFormat = [date.getDate() <= 9 ? "0" + date.getDate() : date.getDate(),
  ((date.getMonth() + 1) < 10 ? '0' : '')+ (date.getMonth() + 1),
  date.getFullYear()].join('/')+' '+
 [date.getHours() <= 9 ? "0" + date.getHours() : date.getHours(),
  date.getMinutes() <= 9 ? "0" + date.getMinutes() : date.getMinutes()].join(':')
    console.log(`Filtering is over, ${data.length} suitable jobs were found`)
    console.log(`end in ${dateFormat}`);
      
    resolve({data , dateFormat});
  });
};

exports.apply = (id) => {
  return new Promise(async (resolve , reject) => {
    const browser = await puppeteer.launch({
      headless: true,
      slowMo: 50,
      waitUntil : 'networkidle2',
      args: [`--proxy-server=149.14.243.178:80`],
    });

    const page = await browser.newPage();
    await page.authenticate({
      username: "yssyzsxj-rotate",
      password: "9x1y2eu9ees9",
    });

    await page.setCookie({
      name: "li_at",
      value:
        "AQEIACMHLvuPQANhymUAAAGDVwWcigAAAYN7FJBuTQAAAAAAAAAAADBFAiEAq3IZXy5QjcZSVnldGQCFDMzMbBNYfyFs_9PS29qY5-MCIAZklhfs7nK-X2Nfl5ssA99mxSm5qUcPDSU1OCPGm4GC1RLUZhQAONQnWL06loxHLIiILZU",
      domain: "www.linkedin.com",
    });
    let url = `https://www.linkedin.com/jobs/view/${id}`;
    await page.goto(url, { waitUntil: "networkidle2" });
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3683.103 Safari/537.36'
    );
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
    });
    
    let applyButton = await page.$(
      "button.jobs-apply-button.artdeco-button.artdeco-button--3.artdeco-button--primary.ember-view"
    );
    if (!applyButton) {
      console.log("apply Button Not Exist" , id);
      await browser.close();
    } else {
      await page.click(
        "button.jobs-apply-button.artdeco-button.artdeco-button--3.artdeco-button--primary.ember-view"
      );

      // Apply Area
      //   Contact info
      let titleFirstSelector = await page.$(".t-16");
      let titleFirst = await page.evaluate(
        (e) => e?.textContent?.trim(),
        titleFirstSelector
      );
      let waitForButton = await page.$(
        "button.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view"
      );
      let buttonSpan = await page.evaluate(
        (e) => e?.textContent?.trim(),
        waitForButton
      );
      if (buttonSpan === "Submit application") {
        await page.click(
          "button.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view"
          );
          await browser.close();
        } else {
        await page.waitForSelector(
          "button.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view"
        );
        await page.click(
          "button.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view"
        );
        //   Resume / Home address
        let titleSecondSelector = await page.$(".t-16");
        let titleSecond = await page.evaluate(
            (e) => e?.textContent?.trim(),
            titleSecondSelector
            );
            await page.click(
              'button.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view'
            )

        // Submit Applicant
        let submitStage = await page.$('.t-18')

        // Additional Questions
            let quiz = await page.$$('.ember-text-field.ember-view.fb-single-line-text__input')
            for (const input in quiz) {
              const element = quiz[input];
                await page.evaluate((element) => { element.value = ''; }, input);
                await element.focus()
                await page.keyboard.press('Backspace')
                await element.type('1')
            }
            let labels = await page.$$('.fb-form-element > .fb-form-element-label > .t-14')
            let arrLabels = []
            for (const i in labels) {
                const element = labels[i];
                let label = await page.evaluate(ele => ele?.textContent.trim() , element)
                arrLabels.push(label);
              }
              let radiosCheck = arrLabels.find(i => i.includes("Are you"))
              if (radiosCheck) {
              let findLocation = arrLabels.find(i => i.includes("Are you comfortable commuting to this job's location?"))
              if(!findLocation) {
                await page.evaluate(() => {
                let radios = document.querySelectorAll('.fb-radio-buttons > .fb-radio > label')
                radios[1].click()
                })
              } else {
                await page.evaluate(() => {
                  let radios = document.querySelectorAll('.fb-radio-buttons > .fb-radio > label')
                  radios[0].click()
                  })
              }
            }


                let selects = await page.$$('.fb-dropdown__select')
                if(selects) {
                  for (const option in selects) {
                    const element = selects[option];
                      await element.select('Native or bilingual')
                  }
                  await page.click(
                    'button.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view'
                  )
                } else {
                  await page.click(
                    'button.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view'
                  )
                }
                
                if(submitStage) {
                  await page.click(
                    'button.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view'
                  )
                }
              resolve('Resumes have been submitted')
        await browser.close()     
        }
      }
  })
}

