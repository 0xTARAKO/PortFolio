export class Crypto {
    constructor( ctx ) {
        this.ctx = ctx
        this.crypto = []
        this.Init()
        this.Request()
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
        this.ticker = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1'
        this.gecko = await fetch( this.ticker ).then( res => res.json())
        this.gecko.forEach( res => {
            this.crypto.push({
                id : res.id ,
                symbol : res.symbol.toUpperCase() ,
                name : res.name ,
                price : res.current_price ,
                percent : Number(res.price_change_percentage_24h).toFixed(2)
            })
        })
    }
    async Draw( prompt ) {
        this.asset = this.crypto.filter( res => { return res.id.toUpperCase() === prompt || res.symbol === prompt })
        if( this.asset.length !== 1 ) return console.log( this.asset )
        this.kline = `https://api.coingecko.com/api/v3/coins/${this.asset[0].id}/market_chart?vs_currency=usd&days=1`
        this.chart = await fetch( this.kline ).then( res => res.json())
        let high , i , height
        high = [...this.chart.prices].sort(( a , b ) => a[1] < b[1] )

        this.ctx.beginPath()
        this.ctx.fillStyle = 'black'
        this.ctx.fillRect( 0 , 0 , 300 , 150 )
        
        this.ctx.beginPath()
        this.grad = this.ctx.createLinearGradient( 150 , 70 , 150 , 110 )
        this.grad.addColorStop( 0.0 , `hsl(${Math.random()*360} 100% 50%)`)
        this.grad.addColorStop( 0.3 , `hsl(${Math.random()*360} 100% 50%)`)
        this.grad.addColorStop( 0.6 , `hsl(${Math.random()*360} 100% 50%)`)
        this.grad.addColorStop( 1.0 , `hsl(${Math.random()*360} 100% 50%)`)
        this.ctx.fillStyle = this.grad
        this.ctx.moveTo( 0 , 150 )
        for( i = 0; i < 288; i++ ) {
            height = ( this.chart.prices[i][1] - high[288][1] ) / ( high[0][1] - high[288][1] )
            this.ctx.lineTo( i * 1.0417 , ( 40 * height ) + 70 )
        }
        this.ctx.lineTo( 300 , 150 )
        this.ctx.fill()

        this.ctx.beginPath()
        this.ctx.fillStyle = 'white'
        this.ctx.font = '20px serif'
        this.ctx.fillText( this.asset[0].symbol +' ( '+ this.asset[0].name +' )', 150 , 30 )
        this.ctx.beginPath()
        this.ctx.fillStyle = 'white'
        this.ctx.font = '40px serif'
        this.ctx.fillText( `${this.asset[0].price} $`, 150 , 80 )
        this.ctx.beginPath()
        this.ctx.font = '20px serif'
        if( this.asset[0].percent >= 0 ) {
            this.ctx.fillStyle = 'green'
            this.ctx.fillText( `+${this.asset[0].percent} %`, 150 , 110 )
        } else {
            this.ctx.fillStyle = 'red'
            this.ctx.fillText( `${this.asset[0].percent} %`, 150 , 100 )
        }
        this.ctx.beginPath()
        this.ctx.fillStyle = 'lime'
        this.ctx.font = '10px serif'
        this.ctx.fillText('Powered By CoinGecko-API' , 150 , 135 )
    }
}