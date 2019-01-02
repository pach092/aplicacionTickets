const { io } = require('../server');
const { TicketControl } = require("../classes/ticketControl")

const ticketControl = new TicketControl()


io.on('connection', (client) => {
    client.on("siguienteTicket", (_data, callback) => {
        let siguiente = ticketControl.siguiente()

        console.log(siguiente);
        callback(siguiente)
    })

    client.emit("estadoActual", {
        actual: ticketControl.getUltimoTicket(),
        ultimos4: ticketControl.getUltimos4()
    })

    client.on("atenderTicket", (data, callback) => {
        if (!data.escritorio) {
            callback({
                err: true,
                mensaje: "El escritorio es necesario"
            })
        }

        let atenderTicket = ticketControl.atenderTicket(data.escritorio)

        callback(atenderTicket)

        client.broadcast.emit("ultimos4", {
            ultimos4: ticketControl.getUltimos4()
        })
    })
})