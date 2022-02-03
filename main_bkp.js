const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: false });

let url = 'https://valorinveste.globo.com/cotacoes/';

nightmare
    .goto(url)
    .wait('#cotacoes-intradia tr')
    .evaluate(() => {

        class Stock {
            constructor(name, ticker, lastPrice, variation, closePrice) {
                this.name = name;
                this.ticker = ticker;
                this.lastPrice = lastPrice;
                this.variation = variation;
                this.closePrice = closePrice;
            }
        }

        let stocks = [];

        const trs = document.querySelectorAll('#cotacoes-intradia tr')

        trs.forEach(tr => {
            const tds = tr.querySelectorAll('td');

            let stock = new Stock(
                tds[0] ? tds[0].innerText : '',
                tds[1] ? tds[1].innerText : '',
                tds[2] ? tds[2].innerText : '',
                tds[3] ? tds[3].innerText : '',
                tds[4] ? tds[4].innerText : '',
            )

            stocks.push(stock);
        })

        return stocks;
    })
    .end()
    .then(result => {
        console.log(JSON.stringify(result))
    })



