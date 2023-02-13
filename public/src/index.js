import { Canvas } from './canvas.js'
import { Crypto } from './crypto.js'

const canvas = new Canvas()
const crypto = new Crypto( canvas.ctx )

onresize = () => canvas.Resize()
onkeydown = onkeyup = onmousemove = event => canvas.Control( event )
onclick = event => {
    if( event.target.id === 'index' ) canvas.tps.position.set( 0 , 2 , -5 )
    if( event.target.id === 'crypto' ) crypto.Draw( event.target.data )
}