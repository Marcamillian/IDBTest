const express = require('express')
const http = require('http')

const app = express();
let server;

app.set('port', (process.env.PORT || 8080))
app.use(express.static('./public'))

server = http.createServer(app);

server.listen(app.get('port'), ()=>{
    console.log(`Node app is running on port ${app.get('port')}`)
})