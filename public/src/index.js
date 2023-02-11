import { Canvas } from './canvas.js'
import { Crypto } from './crypto.js'

const canvas = new Canvas()
const crypto = new Crypto( canvas.ctx )



onload = () => canvas.Animate()
onresize = () => canvas.Resize()
onkeydown = ( e ) => {
    if( e.code === 'KeyP' ) crypto.Draw( prompt('Crypto Currency Symbol').toUpperCase())
}