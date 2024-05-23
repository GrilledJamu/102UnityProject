const WebSocket = require('ws')

// create new websocket server
const wss = new WebSocket.Server({port: 8000})

// empty object to store all players
var players = {}

// add general WebSocket error handler
wss.on('error', function error (error) {
  console.error('WebSocket error', error)
})

// on new client connect
wss.on('connection', function connection (client) {
  console.log('new client connected')
  // on new message recieved
  client.on('message', function incoming (data) {
    // get data from string
    var [udid, x, y, z, p1, p2, p3, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, p25, p26, p27, p28, p29, p30, p31, p32, p33, p34, p35] = data.toString().split('\t')
    // store data to players object
    players[udid] = {
      position: {
        x: parseFloat(x),
        y: parseFloat(y) + 1,
        z: parseFloat(z)
      },
      timestamp: Date.now(),
	  pellets: [
		parseInt(p1),
		parseInt(p2),
		parseInt(p3),
		parseInt(p4),
		parseInt(p5),
		parseInt(p6),
		parseInt(p7),
		parseInt(p8),
		parseInt(p9),
		parseInt(p10),
		parseInt(p11),
		parseInt(p12),
		parseInt(p13),
		parseInt(p14),
		parseInt(p15),
		parseInt(p16),
		parseInt(p17),
		parseInt(p18),
		parseInt(p19),
		parseInt(p20),
		parseInt(p21),
		parseInt(p22),
		parseInt(p23),
		parseInt(p24),
		parseInt(p25),
		parseInt(p26),
		parseInt(p27),
		parseInt(p28),
		parseInt(p29),
		parseInt(p30),
		parseInt(p31),
		parseInt(p32),
		parseInt(p33),
		parseInt(p34),
		parseInt(p35)
	  ]
    }
    // save player udid to the client
    client.udid = udid
  })
})

function broadcastUpdate () {
  // broadcast messages to all clients
  wss.clients.forEach(function each (client) {
    // filter disconnected clients
    if (client.readyState !== WebSocket.OPEN) return
    // filter out current player by client.udid
    var otherPlayers = Object.keys(players).filter(udid => udid !== client.udid)
    // create array from the rest
    var otherPlayersPositions = otherPlayers.map(udid => players[udid])
    // send it
    client.send(JSON.stringify({players: otherPlayersPositions}))
  })
}

// call broadcastUpdate every 0.1s
setInterval(broadcastUpdate, 100)
