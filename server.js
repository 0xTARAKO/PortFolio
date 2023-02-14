const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const app = express()
const server = http.createServer( app )
const io = new Server( server )

app.use( express.static(`${__dirname}/public`))
server.listen( 3000 )

io.on('connection' , socket => {
    io.emit('receive' , `${socket.id} : LOG_IN`)
    socket.on('send' , event => {
        io.emit('receive' , event )
    })
})