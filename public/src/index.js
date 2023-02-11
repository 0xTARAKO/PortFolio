import { Canvas } from './canvas.js'
import { Crypto } from './crypto.js'

const canvas = new Canvas()
const crypto = new Crypto( canvas.ctx )



onload = () => canvas.Animate()
onresize = () => canvas.Resize()
onkeydown = ( e ) => {
    if( e.code === 'KeyP' ) {
        let promp = prompt('Crypto Currency Name or Symbol').toUpperCase()
        let asset = crypto.crypto.filter( res => res.id.toUpperCase() === promp || res.symbol === promp )
        crypto.Draw( asset[0] )
    }
}