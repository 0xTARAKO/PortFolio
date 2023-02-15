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
        let page1 , page2 , page3 , page4
        page1 = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1'
        page2 = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=2'
        page3 = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=3'
        page4 = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=4'
        const [ ticker1 , ticker2 , ticker3 , ticker4 ] = await Promise.all([
            fetch( page1 ).then( res => res.json()) ,
            fetch( page2 ).then( res => res.json()) ,
            fetch( page3 ).then( res => res.json()) ,
            fetch( page4 ).then( res => res.json()) ,
        ])
        this.gecko = [ ticker1 , ticker2 , ticker3 , ticker4 ]
        this.gecko.forEach( page => {
            page.forEach( res => { 
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
        })
        this.Draw( this.crypto[0] )
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
            newLi.innerText = `${asset[i].symbol} ( ${asset[i].name} )`
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
            newLi.innerText = `${this.crypto[i].symbol} ( ${this.crypto[i].name} )`
            newLi.data = this.crypto[i]
            this.list.appendChild( newLi )
        }
    }
    Draw( asset ) {
        this.input.value = `${asset.symbol} ( ${asset.name} )`
        this.list.innerHTML = ''

        this.ctx.beginPath()
        this.ctx.fillStyle = 'black'
        this.ctx.fillRect( 0 , 0 , 300 , 150 )

        this.ctx.beginPath()
        this.ctx.fillStyle = 'white'
        this.ctx.font = '25px serif'
        this.ctx.fillText( `${asset.symbol} ( ${asset.name} )`, 150 , 30 )
        this.ctx.beginPath()
        this.ctx.fillStyle = 'white'
        this.ctx.font = '50px serif'
        this.ctx.fillText( `${asset.price} $`, 150 , 85 )
        this.ctx.beginPath()
        this.ctx.font = '20px serif'
        if( asset.percent >= 0 ) {
            this.ctx.fillStyle = 'green'
            this.ctx.fillText( `+${asset.change}$    +${asset.percent}%`, 150 , 110 )
        } else {
            this.ctx.fillStyle = 'red'
            this.ctx.fillText( `${asset.change}$    ${asset.percent}%`, 150 , 110 )
        }
        this.ctx.beginPath()
        this.ctx.fillStyle = 'white'
        this.ctx.font = '15px serif'
        this.ctx.fillText('Powered By CoinGecko' , 150 , 135 )
    }
}