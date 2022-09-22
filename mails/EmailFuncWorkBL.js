const transporter = require('./smtpMailer')

exports.checkWorkEmail = () => {
    return new Promise((resolve , reject) => {
        let mailOptions = {
            from: '"A bot looking for a job" <No-Reply@splitInvoice.com>', 
            to: 'DanielMaximov2@gmail.com', 
            subject: `The bot still works`, 
            html: `
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2; direction: ltr;">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <h2>The bot still works</h2>
              </div>
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
                resolve(`send to email` , info.messageId , info.response)
            }
            });

    })
    
}
