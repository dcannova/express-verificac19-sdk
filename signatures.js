const {Service} = require('verificac19-sdk');
const mailer = require('./inc/mailer');


const main = async () => {
    try {
        await Service.updateAll();
    } catch (err) {
        console.log(`${err}`);
        mailer.send('GreenPassTester - Errore aggiornamento signatures', 
                    `<b>Errore</b><br/>${err}`); 
    }
}

main();