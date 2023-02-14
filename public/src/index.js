import { Canvas } from './canvas.js'
import { Crypto } from './crypto.js'
import { Chat } from './chat.js'

const canvas = new Canvas()
const crypto = new Crypto( canvas.ctx )
const chat = new Chat()

onresize = () => canvas.Resize()
onkeydown = onkeyup = onmousemove = event => canvas.Control( event )
onclick = event => {
    if( event.target.id === 'volume' ) crypto.Sort( true )
    if( event.target.id === 'percent' ) crypto.Sort( false )
    if( event.target.id === 'crypto' )  canvas.tps.position.set( 0 , 2 , -5 ) , crypto.Draw( event.target.data )
    if( event.target.id === 'send' ) chat.Send()
    if( event.target.id === 'open' ) chat.Look()
}