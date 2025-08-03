/*

€ Creator: Tama Ryuichi
€ Base: Tama Ryuichi
*Social Media*
 Github: https://github.com/Tama-Ryuichi
 Youtube: https://youtube.com/@tamainfinity
 Telegram: https://t.me/tamainfinity
 
<!> 
#Creator ( Tama Ryuichi )
©2024 - Tama

ini adalah base bot whatsapp simple buatanku jadi pakai aja kalau kamu tertarik.


#Developer ( Tama Ryuichi )
©2024 - Tama

This is my simple WhatsApp bot base, so feel free to use it if you're interested.

Don't Remove This Credits

*/

console.clear();
console.log("Loading...");
require('./settings/config');
process.on("uncaughtException", console.error);
const fs = require("fs");
const util = require("util");
const pino = require("pino");
const fetch = require("node-fetch");
const { Boom } = require('@hapi/boom');
const chalk = require("chalk");
const readline = require("readline");
const {
default: makeWASocket,
makeCacheableSignalKeyStore,
useMultiFileAuthState,
DisconnectReason,
fetchLatestBaileysVersion,
generateForwardMessageContent,
prepareWAMessageMedia,
generateWAMessageFromContent,
generateMessageID,
downloadContentFromMessage,
makeInMemoryStore,
getContentType,
jidDecode,
MessageRetryMap,
getAggregateVotesInPollMessage,
proto,
delay
} = require("@whiskeysockets/baileys")
const PhoneNumber = require("awesome-phonenumber");
const FileType = require("file-type");
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, sleep } = require('./system/storage.js');
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid, addExif } = require('./system/exif.js');
const { color } = require("./system/color.js");

const usePairingCode = true;

const question = (text) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => rl.question(text, answer => {
        rl.close();
        resolve(answer);
    }));
};

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState("./session");

    const versionData = await fetch('https://raw.githubusercontent.com/Tama-Ryuichi/bails/refs/heads/master/lib/Defaults/baileys-version.json').then(res => res.json());

    const client = makeWASocket({
        printQRInTerminal: !usePairingCode,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }))
        },
        version: versionData.version,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        syncFullHistory: true,
        markOnlineOnConnect: true,
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 10000,
        generateHighQualityLinkPreview: true,
        patchMessageBeforeSending: (message) => {
            const needsPatch = !!(message.buttonsMessage || message.templateMessage || message.listMessage);
            if (needsPatch) {
                message = {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadataVersion: 2,
                                deviceListMetadata: {},
                            },
                            ...message,
                        },
                    },
                };
            }
            return message;
        },
        logger: pino({ level: "silent" }),
    });

    if (!client.authState.creds.registered) {
        const phoneNumber = await question(chalk.blue.bold("Masukan Nomor WhatsApp : "));
        try {
            const code = await client.requestPairingCode(phoneNumber.trim());
            console.log(chalk.blue.bold("Pairing Code: ") + chalk.white.bold(code));
        } catch (err) {
            console.log(chalk.redBright("Gagal mendapatkan pairing code!"));
            console.error(err);
            process.exit(1);
        }
    }

    const store = makeInMemoryStore({
        logger: pino({ level: "silent" })
    });

    store.bind(client.ev);
    
    client.ev.on('connection.update', async (update) => {
    let { stats } = require("./system/updates.js");
    stats({ update, client, Boom, DisconnectReason, sleep, color, connectToWhatsApp });
    })

    client.ev.on("messages.upsert", async chatUpdate => {
        try {
            const mek = chatUpdate.messages[0];
            if (!mek.message) return;

            mek.message = (Object.keys(mek.message)[0] === "ephemeralMessage") ?
                mek.message.ephemeralMessage.message : mek.message;

            if (mek.key && mek.key.remoteJid === "status@broadcast") return;

            if (!client.public && !mek.key.fromMe && chatUpdate.type === "notify") return;

            const m = smsg(client, mek, store);
            require("./menu/case")(client, m, chatUpdate, store);
        } catch (err) {
            console.log(chalk.yellow.bold("[ ERROR ] case.js :\n") + chalk.redBright(util.format(err)));
        }
    });

    client.ev.on("contacts.update", update => {
        for (let contact of update) {
            const id = client.decodeJid(contact.id);
            if (store && store.contacts) {
                store.contacts[id] = {
                    id,
                    name: contact.notify
                };
            }
        }
    });

    client.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            const decode = jidDecode(jid) || {};
            return (decode.user && decode.server) ? decode.user + "@" + decode.server : jid;
        }
        return jid;
    };

    client.getName = async (jid, withoutContact = false) => {
        const id = client.decodeJid(jid);
        const contact = store.contacts[id] || {};
        if (id.endsWith("@g.us")) {
            const metadata = await client.groupMetadata(id).catch(() => null);
            return metadata?.subject || contact.name || contact.subject || id;
        }
        return (
            (!withoutContact ? contact.name : "") ||
            contact.subject ||
            contact.verifiedName ||
            PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber("international")
        );
    };
    
    client.sendText = (jid, text, quoted = '', options) => client.sendMessage(jid, { text, ...options }, { quoted });
    
    client.sendTextWithMentions = async (jid, text, quoted, options = {}) =>
        client.sendMessage(jid, {
            text,
            contextInfo: {
                mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + "@s.whatsapp.net"),
            },
            ...options,
        }, { quoted });

    client.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        const buffer = await resolveStickerBuffer(path, options, true);
        await client.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
        return buffer;
    };

    client.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        const buffer = await resolveStickerBuffer(path, options, false);
        await client.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
        return buffer;
    };

    async function resolveStickerBuffer(path, options, isImage = true) {
        let buff = Buffer.isBuffer(path)
            ? path
            : /^data:.*?\/.*?;base64,/i.test(path)
                ? Buffer.from(path.split(",")[1], "base64")
                : /^https?:\/\//.test(path)
                    ? await (await getBuffer(path))
                    : fs.existsSync(path)
                        ? fs.readFileSync(path)
                        : Buffer.alloc(0);

        if (options && (options.packname || options.author)) {
            return isImage ? await writeExifImg(buff, options) : await writeExifVid(buff, options);
        } else {
            return isImage ? await imageToWebp(buff) : await videoToWebp(buff);
        }
    }

    client.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        const quoted = message.msg || message;
        const mime = quoted.mimetype || "";
        const messageType = message.mtype || mime.split("/")[0];

        const stream = await downloadContentFromMessage(quoted, messageType);
        let buffer = Buffer.from([]);

        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        const type = await FileType.fromBuffer(buffer);
        const trueFileName = attachExtension ? `${filename}.${type.ext}` : filename;
        fs.writeFileSync(trueFileName, buffer);

        return trueFileName;
    };

    client.downloadMediaMessage = async (message) => {
        const mime = (message.msg || message).mimetype || '';
        const messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
        const stream = await downloadContentFromMessage(message, messageType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        return buffer;
    };

    client.copyNForward = async (jid, message, forceForward = false, options = {}) => {
        if (options.readViewOnce) {
            const vtype = Object.keys(message.message.viewOnceMessage.message)[0];
            delete message.message.viewOnceMessage.message[vtype].viewOnce;
            message.message = message.message.viewOnceMessage.message;
        }

        const mtype = Object.keys(message.message)[0];
        const content = await generateForwardMessageContent(message, forceForward);
        const objtype = Object.keys(content)[0];
        const context = message.message[mtype]?.contextInfo || {};

        content[objtype].contextInfo = {
            ...context,
            ...content[objtype].contextInfo,
        };

        const msg = await generateWAMessageFromContent(jid, content, {
            ...content[objtype],
            ...options,
            contextInfo: {
                ...content[objtype].contextInfo,
                ...(options.contextInfo || {})
            }
        });

        await client.relayMessage(jid, msg.message, { messageId: msg.key.id });
        return msg;
    };

    client.serializeM = (m) => smsg(client, m, store);

    client.ev.on("creds.update", saveCreds);

    return client;
}

connectToWhatsApp();

fs.watchFile(require.resolve(__filename), () => {
    fs.unwatchFile(require.resolve(__filename));
    console.log(chalk.redBright(`Update ${__filename}`));
    delete require.cache[require.resolve(__filename)];
    require(__filename);
});