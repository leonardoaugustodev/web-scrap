const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: false });

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');


const serviceAccount = require('./web-scrap-340117-af5fb76a0a10.json');

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

let url = 'https://br.investing.com/equities/brazil';

nightmare
    .goto(url)
    .wait('#cross_rate_markets_stocks_1')
    .evaluate(() => {

        class Stock {
            constructor(name, lastPrice, maxPrice, minPrice, variation, variationPercent, volume, lastUpdate) {
                this.name = name;
                // this.ticker = ticker;
                this.lastPrice = lastPrice;
                this.maxPrice = maxPrice;
                this.minPrice = minPrice;
                this.variation = variation;
                this.variationPercent = variationPercent;
                this.volume = volume;
                this.lastUpdate = lastUpdate;
            }
        }

        let stocks = [];

        const tbody = document.querySelector('tbody');

        const trs = tbody.querySelectorAll('tr')

        trs.forEach(tr => {
            const tds = tr.querySelectorAll('td');

            let stock = new Stock(
                tds[1] ? tds[1].innerText : '',
                tds[2] ? tds[2].innerText : '',
                tds[3] ? tds[3].innerText : '',
                tds[4] ? tds[4].innerText : '',
                tds[5] ? tds[5].innerText : '',
                tds[6] ? tds[6].innerText : '',
                tds[7] ? tds[7].innerText : '',
                tds[8] ? tds[8].innerText : '',
            )

            stocks.push(stock);
        })

        return stocks;
    })
    .end()
    .then(result => {
        // console.log(JSON.stringify(result))
        write(result);
    })

    
async function write(stocks) {

    const batch = db.batch();

    stocks.forEach(stock => {
        const stockRef = db.collection('bovespa').doc(stock.name);
        batch.set(stockRef, stock);
    });

    await batch.commit();


}

// write();

