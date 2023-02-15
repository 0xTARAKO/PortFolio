export class Crypto {
    constructor( ctx ) {
        this.ctx = ctx
        this.tps = document.getElementById('tps')
        this.input = document.getElementById('index')
        this.list = document.getElementById('list')
        this.open = true
        this.crypto = []
        this.Request()
        this.input.oninput = () => this.Search( this.input.value.toUpperCase() )
    }
    async Request() {
        let cap , percent , volume , dominance
        let url01 = 'https://api.coingecko.com/api/v3/global'
        let url02 = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1'
        const [ market , ticker ] = await Promise.all([
            fetch( url01 ).then( res => res.json()) ,
            fetch( url02 ).then( res => res.json()) ,
        ])
        cap = market.data.total_market_cap.usd / 1000000000
        percent = ( market.data.market_cap_change_percentage_24h_usd ).toFixed(2)
        volume = ( cap * ( percent / 100 )).toFixed(2)
        dominance = ( market.data.market_cap_percentage.btc ).toFixed(2)

        this.ctx.beginPath()
        this.ctx.fillStyle = 'black'
        this.ctx.fillRect( 0 , 0 , 300 , 150 )
        this.ctx.beginPath()
        this.ctx.fillStyle = 'white'
        this.ctx.font = '15px serif'
        this.ctx.fillText( 'Total Market Cap' , 150 , 20 )
        this.ctx.fillStyle = 'green'
        this.ctx.font = '30px serif'
        this.ctx.fillText(`$${cap.toFixed(2)} B` , 150 , 50 )
        this.ctx.font = '15px serif'
        this.ctx.fillText(`$${volume} B  /  ${percent}%` , 150 , 70 )
        this.ctx.fillStyle = 'white'
        this.ctx.fillText( 'Bitcoin dominance' , 150 , 90 )
        this.ctx.font = '20px serif'
        this.ctx.fillText( `${dominance}%` , 150 , 115 )

        this.ctx.font = '10px serif'
        this.ctx.fillText('Powered By CoinGecko' , 150 , 135 )
        

        ticker.forEach( res => { 
            this.crypto.push({
                id : res.id ,
                symbol : res.symbol.toUpperCase() ,
                name : res.name ,
                price : res.current_price ,
                change : Number(res.price_change_24h).toFixed(4) ,
                percent : Number(res.price_change_percentage_24h).toFixed(2) ,
                volume : res.total_volume
            })
        })
    }
    View() {
        if( this.open ) {
            this.open = false
            this.tps.hidden = true
        }
        else {
            this.open = true
            this.tps.hidden = false
        }
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
            newLi.innerText = `${asset[i].symbol} // ${asset[i].name}`
            newLi.data = asset[i]
            this.list.appendChild( newLi )
        }
    }
    Sort( type ) {
        this.list.innerHTML = ''
        type ? this.crypto.sort(( a , b ) => b.volume - a.volume ) : this.crypto.sort(( a , b ) => b.percent - a.percent )
        let i , newLi
        for( i in this.crypto ) {
            newLi = document.createElement('li')
            newLi.id = 'crypto'
            newLi.innerText = `${this.crypto[i].symbol} // ${this.crypto[i].name}`
            newLi.data = this.crypto[i]
            this.list.appendChild( newLi )
        }
    }
    Draw( asset ) {
        this.input.value = asset.name
        this.list.innerHTML = ''

        this.ctx.beginPath()
        this.ctx.fillStyle = 'black'
        this.ctx.fillRect( 0 , 0 , 300 , 150 )

        this.ctx.fillStyle = 'white'
        this.ctx.font = '25px serif'
        this.ctx.fillText( `${asset.symbol} // ${asset.name}`, 150 , 30 )
        this.ctx.font = '50px serif'
        this.ctx.fillText( `$${asset.price}`, 150 , 85 )
        this.ctx.font = '20px serif'
        asset.percent >= 0 ? this.ctx.fillStyle = 'green' : this.ctx.fillStyle = 'red'
        this.ctx.fillText( `$${asset.change}   ${asset.percent}%`, 150 , 110 )
        this.ctx.fillStyle = 'white'
        this.ctx.font = '10px serif'
        this.ctx.fillText('Powered By CoinGecko' , 150 , 135 )
    }
}