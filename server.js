const {Certificate, Validator} = require('verificac19-sdk');

const express = require('express');
const app = express();
const morgan = require('morgan');
const mailer = require('./inc/mailer');

app.set('view engine', 'ejs');
app.listen(3001);

app.use(express.static('public'));
app.use(morgan('dev'));

console.log('Server avviato');

// lista funzioni disponibili
const menu = [
    {name: 'Home Node Server', url: '/'},
    {name: 'Green Pass Tester', url: '/greenpasstester'}
];

// home 
app.get('/', (req, res) => {
    res.render('index', {title: 'Home Node Server', menu: menu});
});

// pagina di test webservice /greenpassdecoder
app.get('/greenpasstester', async(req, res) => {
    res.render('greenpasstester', {title: 'Green Pass Tester', menu: menu});
});

// webservice endpoint
app.get('/greenpassdecoder', async(req, res) => {
    let rc = req.query.rawcode;

    // Vecchio codice fatto in casa
    //let response = await validator.validaRawCode(rc, '1');
    let response = "";

    try {
        const DCCfromRaw = await Certificate.fromRaw(rc);
        response = await Validator.validate(DCCfromRaw);

        /* Rielaboro il response dell'sdk per compatiblilità con il formato sfruttato dal webservice APP/ws.aspx */
        const valid = (
                        response.code === Validator.codes.VALID ||
                        response.code === Validator.codes.PARTIALLY_VALID
                      ) ? "valid" : "invalid";

        response = 
        {
            "status": response.result,
            "valid": valid,
            "valid_note": response.message,
            "payload": {
              "dob": response.date_of_birth,
              "nam": {
                "fn": DCCfromRaw.person.familyName,
                "gn": DCCfromRaw.person.givenName,
              }
            }
        };
    } catch(err) {
        response = `[[ERROR]]${err}`;
        mailer.send('GreenPassTester - Errore', `<b>Rawcode</b><br/>${rc}<br/><b>Errore</b><br/>${err}`); 
    }
    
    res.type('json')
    res.write(JSON.stringify(response));
    res.end();
});

app.use((req, res) => {
    res.status(400).render('404');
});