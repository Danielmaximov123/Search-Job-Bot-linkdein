const express = require('express')
const cors = require('cors');
const { scrapeJobs, scrapeJob, filterJobs, apply } = require('./BL/scrape jobs');
const app = express()
const sound = require("sound-play");
const path = require("path");
const { sendMail } = require('./mails/EmailBL');
const { checkWorkEmail } = require('./mails/EmailFuncWorkBL');

app.use(cors())
app.use(express.json())

    
    const linkedin = async () => {
        try {
            let date = new Date
            let dateFormat = [date.getDate() <= 9 ? "0" + date.getDate() : date.getDate(),
            ((date.getMonth() + 1) < 10 ? '0' : '')+ (date.getMonth() + 1),
            date.getFullYear()].join('/')+' '+
           [date.getHours() <= 9 ? "0" + date.getHours() : date.getHours(),
            date.getMinutes() <= 9 ? "0" + date.getMinutes() : date.getMinutes()].join(':')
            
            console.log("start in" , dateFormat);
            let getId = await scrapeJobs()
            console.log('job list ' , getId.length);
            let allJobsData = []
            for (const obj in getId) {
                const element = getId[obj];
                let len = getId.length
                let getJobsData = await scrapeJob(element , Number(obj) + 1 , len)
                    allJobsData.push(getJobsData)
                }
            console.log(`We have details of ${allJobsData.length} Jobs`);
            let filterData = await filterJobs(allJobsData , allJobsData.length)
            if(filterData.data.length > 0 ) {
                for (const job in filterData.data) {
                    const element = filterData.data[job];
                    const dateApply = filterData.dateFormat
                    await apply(element.id)
                    return sendMail(element , dateApply)
                }
            } else {
                console.log('There are no suitable jobs');
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    let linkedinRunning = false     

    setInterval(async () => {
        console.log('Trying to find a job.');
        if(!linkedinRunning) {
            linkedinRunning = true
            await linkedin()
            linkedinRunning = false
        }
        }, 60000 * 30 )

    setInterval( () => {
        checkWorkEmail()
        }, 3600000 * 6 )

        console.log("ok");


