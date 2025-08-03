const chalk = require("chalk")

const stats = async ({
  update,
  client,
  Boom,
  DisconnectReason,
  sleep,
  color,
  connectToWhatsApp,
}) => {   
     const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            console.log(color(lastDisconnect.error, 'deeppink'));
            if (lastDisconnect.error == 'Error: Stream Errored (unknown)') {
                process.exit();
            } else if (reason === DisconnectReason.badSession) {
                console.log(chalk.red.bold(`bad session file, please delete session and scan again`));
                process.exit();
            } else if (reason === DisconnectReason.connectionClosed) {
                console.log(chalk.red.bold('connection closed, reconnecting...'));
                process.exit();
            } else if (reason === DisconnectReason.connectionLost) {
                console.log(chalk.red.bold('connection lost, trying to reconnect'));
                process.exit();
            } else if (reason === DisconnectReason.connectionReplaced) {
                console.log(chalk.red.bold('connection replaced, another new session opened, please close current session first'));
                client.logout();
            } else if (reason === DisconnectReason.loggedOut) {
                console.log(chalk.red.bold(`device logged out, please scan again and run.`));
                client.logout();
            } else if (reason === DisconnectReason.restartRequired) {
                console.log(chalk.yellow.bold('restart required,restarting...'));
                await connectToWhatsApp();
            } else if (reason === DisconnectReason.timedOut) {
                console.log(chalk.yellow.bold('connection timedOut, reconnecting...'));
                connectToWhatsApp();
            }
        } else if (connection === "connecting") {
            console.log(chalk.blue.bold('connecting . . .'));
        } else if (connection === "open") {
            console.log(chalk.blue.bold('Bot Connected'));
        }}
 
 module.exports = { stats };