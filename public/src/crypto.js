export class Crypto {
    constructor( ctx ) {
        this.ctx = ctx
        this.input = document.getElementById('index')
        this.list = document.getElementById('list')
        this.crypto = []
        this.Init()
        this.Request()
        this.input.oninput = () => this.Search( this.input.value.toUpperCase() )
    }
    async Init() {
        this.cap = await fetch('https://api.coingecko.com/api/v3/global').then( res => res.json())
        this.cap_change = this.cap.data.total_market_cap.usd * this.cap.data.market_cap_change_percentage_24h_usd
        this.ctx.fillStyle = 'black'
        this.ctx.fillRect( 0 , 0 , 300 , 150 )
        this.ctx.beginPath()
        this.ctx.fillStyle = 'white'
        this.ctx.font = '15px serif'
        this.ctx.fillText('Crypto Currencies' , 150 , 20 )
        this.ctx.fillText('Total Market Cap' , 150 , 70 )
        this.ctx.beginPath()
        this.ctx.fillStyle = 'white'
        this.ctx.font = '25px serif'
        this.ctx.fillText( this.cap.data.active_cryptocurrencies , 150 , 50 )
        this.ctx.fillText(`${( this.cap.data.total_market_cap.usd / 1000000000000 ).toFixed(2)}T $` , 150 , 100 )
        this.ctx.beginPath()
        this.ctx.font = '10px serif'
        this.cap.data.market_cap_change_percentage_24h_usd >= 0 ? this.ctx.fillStyle = 'green' : this.ctx.fillStyle = 'red'
        this.ctx.fillText(`${( this.cap_change / 1000000000 ).toFixed(2)}M $` , 120 , 115 )
        this.ctx.fillText(`${( this.cap.data.market_cap_change_percentage_24h_usd ).toFixed(2)}%` , 180 , 115 )
        this.ctx.beginPath()
        this.ctx.fillStyle = 'lime'
        this.ctx.font = '10px serif'
        this.ctx.fillText('Powered By CoinGecko-API' , 150 , 135 )
    }
    async Request() {
        let page1 , page2 , page3 , page4
        page1 = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1'
        page2 = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=2'
        page3 = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=3'
        page4 = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=4'
        const [ ticker1 , ticker2 , ticker3 , ticker4 ] = await Promise.all([
            fetch( page1 ).then( res => res.json()) ,
            fetch( page2 ).then( res => res.json()) ,
            fetch( page3 ).then( res => res.json()) ,
            fetch( page4 ).then( res => res.json())
        ])
        this.gecko = [ ticker1 , ticker2 , ticker3 , ticker4 ]
        this.gecko.forEach( page => {
            page.forEach( res => { 
                this.crypto.push({
                    id : res.id ,
                    symbol : res.symbol.toUpperCase() ,
                    name : res.name ,
                    price : res.current_price ,
                    percent : Number(res.price_change_percentage_24h).toFixed(2)
                })
            })
        })
    }
    Search( value ) {
        this.list.innerHTML = ''
        let asset , i , newLi
        if( value === null || value === '' ) return
        asset = this.crypto.filter( res =>
            res.id.toUpperCase().slice( 0 , value.length ) === value.toUpperCase() ||
            res.symbol.slice( 0 , value.length ) === value.toUpperCase()
        )
        for( i in asset ) {
            newLi = document.createElement('li')
            newLi.id = 'crypto'
            newLi.innerText = `${asset[i].symbol} ( ${asset[i].name} )`
            newLi.data = asset[i]
            this.list.appendChild( newLi )
        }
    }
    async Draw( asset ) {
        this.input.value = `${asset.symbol} ( ${asset.name} )`
        this.list.innerHTML = ''

        this.ctx.beginPath()
        this.ctx.fillStyle = 'black'
        this.ctx.fillRect( 0 , 0 , 300 , 150 )

        this.ctx.beginPath()
        this.ctx.fillStyle = 'white'
        this.ctx.font = '20px serif'
        this.ctx.fillText( `${asset.symbol} ( ${asset.name} )`, 150 , 30 )
        this.ctx.beginPath()
        this.ctx.fillStyle = 'white'
        this.ctx.font = '40px serif'
        this.ctx.fillText( `${asset.price} $`, 150 , 80 )
        this.ctx.beginPath()
        this.ctx.font = '20px serif'
        if( asset.percent >= 0 ) {
            this.ctx.fillStyle = 'green'
            this.ctx.fillText( `+${asset.percent} %`, 150 , 110 )
        } else {
            this.ctx.fillStyle = 'red'
            this.ctx.fillText( `${asset.percent} %`, 150 , 110 )
        }
        this.ctx.beginPath()
        this.ctx.fillStyle = 'lime'
        this.ctx.font = '10px serif'
        this.ctx.fillText('Powered By CoinGecko-API' , 150 , 135 )
    }
}