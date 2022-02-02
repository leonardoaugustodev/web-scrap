const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true })


nightmare
    .goto('https://coinmarketcap.com/pt-br/currencies/bitcoin/')
    .evaluate(() => {

        const result = [];
        const table = document.querySelector('div.priceValue.smallerPrice');

        return table.innerText;
    })
    .end()
    .then(result => {
        console.log(JSON.stringify(result))
    })
    .catch(error => {
        console.error('Search failed:', error)
    })

