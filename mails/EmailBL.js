const transporter = require('./smtpMailer')

exports.sendMail = (data , date) => {
    return new Promise((resolve , reject) => {
        let mailOptions = {
            from: '"Bot Send CV" <No-Reply@splitInvoice.com>', 
            to: 'My-Mail', 
            subject: `Bot Send CV in `, 
            html: `
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2; direction: ltr;">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <h2>Your job application has been successfully submitted</h2>
              </div>
              <p style="font-size:1.1em">Hi,</p>
              <p><a href="https://www.linkedin.com/jobs/view/${data.id}">Visit the job on LinkedIn</a></p>
              <p>Job title: ${data.title}</p>
              <p>Company Name : ${data.company}</p>
              <p>City : ${data.area}</p>
              <p>at: ${date}</p>
              <p style="font-size:0.9em;">Regards,<br />Your Bot</p>
              <hr style="border:none;border-top:1px solid #eee" />
            </div>
          </div>
            `
        };
    
        transporter.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error)
            } else {
                resolve(`${data.id} has send to email` , info.messageId , info.response)
            }
            });
    })
    
}
