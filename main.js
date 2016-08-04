/* 
 * ... License Headers ...  
 */

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var EmailTemplate = require('email-templates').EmailTemplate;
var fs = require('fs');

// отправка через SMTP GMail
var transport = nodemailer.createTransport(
    smtpTransport({
        service: 'gmail',
        auth: {
          user: 't0634781041@gmail.com',
          pass: 'grishko92'
        }
    })
);

// create template based sender function
// assumes text.{ext} and html.{ext} in template/directory
var sendPwdReminder = transport.templateSender(new EmailTemplate('./template/welcome-email/'), {
    from: 't0634781041@gmail.com',
});

// чтение .csv файла в многомерный массив
var result = [];

fs.readFile('./data.csv', function(err, data) {
    if(err) throw err;
    var array = data.toString().split("\r\n");
    for(i in array) {
        var record = {};
        record.name = array[i].toString().split(";")[0];
        record.email = array[i].toString().split(";")[1];
              
        // use template based sender to send a message
        sendPwdReminder({
            to: record.email,
            // EmailTemplate renders html and text but no subject so we need to
            // set it manually either here or in the defaults section of templateSender()
            subject: '...на вакансию Junior Front-End Devoloper / HTML-верстальщик в отдел WEB-разработок, Черкассы'
        }, {
            username: record.name
        }, function(err, info){
            if(err){
                console.log('Error. E-mail претенденту ' + record.name + ' не было отправлено по адресу ' + record.email);
            }else{
                console.log('Success. E-mail претенденту ' + record.name + ' было отправлено по адресу ' + record.email);
            }
        });  
        
        result.push(record);  
    }
   console.log(result);
});