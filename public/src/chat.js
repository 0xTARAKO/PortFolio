export class Chat {
    constructor() {
        this.crypto = document.getElementById('crypto')
        this.chat = document.getElementById('chat')
        this.board = document.getElementById('board')
        this.window = true
        this.socket = io()
        this.socket.on('receive' , event => { this.Receive( event )})
    }
    Receive( event ) {
        let text = document.createElement('textaria')
        text.id = 'text'
        text.innerText = event
        this.board.appendChild( text )
    }
    Send() {
        this.socket.emit('send' , this.chat.value )
        this.chat.value = ''
    }
    Look() {
        if( this.window ) {
            this.window = false
            document.getElementById('tps').hidden = true
        }
        else {
            this.window = true
            document.getElementById('tps').hidden = false
        }
    }
}