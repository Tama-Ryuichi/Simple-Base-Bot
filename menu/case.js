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
require('../settings/config')
const { 
  default: baileys, proto, jidNormalizedUser, generateWAMessage, 
  generateWAMessageFromContent, getContentType, prepareWAMessageMedia 
} = require("@whiskeysockets/baileys");

const {
  downloadContentFromMessage, emitGroupParticipantsUpdate, emitGroupUpdate, 
  generateWAMessageContent, makeInMemoryStore, MediaType, areJidsSameUser, 
  WAMessageStatus, downloadAndSaveMediaMessage, AuthenticationState, 
  GroupMetadata, initInMemoryKeyStore, MiscMessageGenerationOptions, 
  useSingleFileAuthState, BufferJSON, WAMessageProto, MessageOptions, 
  WAFlag, WANode, WAMetric, ChatModification, MessageTypeProto, 
  WALocationMessage, WAContextInfo, WAGroupMetadata, ProxyAgent, 
  waChatKey, MimetypeMap, MediaPathMap, WAContactMessage, 
  WAContactsArrayMessage, WAGroupInviteMessage, WATextMessage, 
  WAMessageContent, WAMessage, BaileysError, WA_MESSAGE_STATUS_TYPE, 
  MediariyuInfo, URL_REGEX, WAUrlInfo, WA_DEFAULT_EPHEMERAL, 
  WAMediaUpload, mentionedJid, processTime, Browser, MessageType, 
  Presence, WA_MESSAGE_STUB_TYPES, Mimetype, relayWAMessage, Browsers, 
  GroupSettingChange, DisriyuectReason, WASocket, getStream, WAProto, 
  isBaileys, AnyMessageContent, fetchLatestBaileysVersion, 
  templateMessage, InteractiveMessage, Header 
} = require("@whiskeysockets/baileys");

const fs = require('fs')
const util = require('util')
const chalk = require('chalk')
const os = require('os')
const axios = require('axios')
const fsx = require('fs-extra')
const crypto = require('crypto')
const ffmpeg = require('fluent-ffmpeg')
const speed = require('performance-now')
const timestampp = speed();
const jimp = require("jimp")
const latensi = speed() - timestampp
const moment = require('moment-timezone')
const { smsg, tanggal, getTime, isUrl, sleep, clockString, runtime, fetchJson, getBuffer, jsonformat, format, parseMention, getRandom, getGroupAdmins, generateProfilePicture } = require('../system/storage')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid, addExif } = require('../system/exif.js')

module.exports = client = async (client, m, chatUpdate, store) => {
const { from } = m
try {
      
const body = (
  // Pesan teks biasa
  m.mtype === "conversation" ? m.message.conversation :
  m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :

  // Pesan media dengan caption
  ["imageMessage", "videoMessage", "documentMessage", "audioMessage", "stickerMessage"]
    .includes(m.mtype) ? m.message[m.mtype].caption || "" :

  // Pesan interaktif (tombol, list, dll.)
  m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
  m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
  m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
  m.mtype === "interactiveResponseMessage" ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id :

  // Pesan khusus
  m.mtype === "messageContextInfo" ? (
    m.message.buttonsResponseMessage?.selectedButtonId ||
    m.message.listResponseMessage?.singleSelectReply.selectedRowId || 
    m.text
  ) :
  m.mtype === "reactionMessage" ? m.message.reactionMessage.text :
  m.mtype === "contactMessage" ? m.message.contactMessage.displayName :
  m.mtype === "contactsArrayMessage" ? 
    m.message.contactsArrayMessage.contacts.map(c => c.displayName).join(", ") :
  ["locationMessage", "liveLocationMessage"].includes(m.mtype) ? 
    `${m.message[m.mtype].degreesLatitude}, ${m.message[m.mtype].degreesLongitude}` :
  ["pollCreationMessage", "pollUpdateMessage"].includes(m.mtype) ? m.message[m.mtype].name :
  m.mtype === "groupInviteMessage" ? m.message.groupInviteMessage.groupJid :

  // Pesan sekali lihat (View Once)
  ["viewOnceMessage", "viewOnceMessageV2", "viewOnceMessageV2Extension"].includes(m.mtype) ? (
    m.message[m.mtype].message.imageMessage?.caption || 
    m.message[m.mtype].message.videoMessage?.caption || 
    "[Pesan sekali lihat]"
  ) :

  // Pesan sementara (ephemeralMessage)
  m.mtype === "ephemeralMessage" ? (
    m.message.ephemeralMessage.message.conversation ||
    m.message.ephemeralMessage.message.extendedTextMessage?.text || 
    "[Pesan sementara]"
  ) :

  // Pesan lain
  m.mtype === "interactiveMessage" ? "[Pesan interaktif]" :
  m.mtype === "protocolMessage" ? "[Pesan telah dihapus]" :
  ""
);

const budy = (typeof m.text == 'string' ? m.text : '');
const prefix = global.prefa 
  ? /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(body) 
    ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0] 
    : "" 
  : global.prefa ?? global.prefix;

const owner = JSON.parse(fs.readFileSync('./system/owner.json'));
const Premium = JSON.parse(fs.readFileSync('./system/premium.json'));
const isCmd = body.startsWith(prefix);
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
const args = body.trim().split(/ +/).slice(1);
const botNumber = await client.decodeJid(client.user.id);
const isCreator = [botNumber, ...owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender);
const isPremium = [botNumber, ...Premium].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender);
const qtext = q = args.join(" ");
const quoted = m.quoted ? m.quoted : m;
const from = mek.key.remoteJid;
const { spawn, exec } = require('child_process');
const sender = m.isGroup ? (m.key.participant || m.participant) : m.key.remoteJid;
const groupMetadata = m.isGroup ? await client.groupMetadata(from).catch(e => {}) : '';
const participants = m.isGroup ? groupMetadata.participants : '';
const groupAdmins = m.isGroup ? getGroupAdmins(participants) : '';
const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false;
const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
const groupName = m.isGroup ? groupMetadata.subject : "";
const pushname = m.pushName || "No Name";
const time = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('HH:mm:ss z');
const mime = (quoted.msg || quoted).mimetype || '';
const todayDateWIB = new Date().toLocaleDateString('id-ID', {
  timeZone: 'Asia/Jakarta',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

if (!client.public) {
if (!isCreator) return
}

switch(command) {
case 'menu': {
let Menu = `𝗜𝗻𝗳𝗼
 ▢ Developer : Tama Ryuichi
 ▢ Prefix : Multi

𝗢𝘄𝗻𝗲𝗿
 ▢ Addown
 ▢ Delown
 ▢ Addprem
 ▢ Delprem
 ▢ Public
 ▢ Self
 ▢ <
 ▢ >
 ▢ $`
client.sendMessage(m.chat, {
  image: { url: global.gambar },
  caption: Menu,
  footer: "Simple Bot WhatsApp By Tama Ryuichi",
  headerType: 4,
  hasMediaAttachment: true,
  contextInfo: {
    mentionedJid: [m.chat],
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast",
    forwardingScore: 99999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363321780343299@newsletter",
      serverMessageId: 1,
      newsletterName: "Tama Exposed"
    }
  }
}, { quoted: m });
}
break;

case 'addowner': case 'addown': {
    if (!isCreator) return m.reply("Owner only.");
    if (!args[0]) return m.reply(`Usage: ${command} 62xxx`);

    let number = qtext.replace(/[^0-9]/g, '');
    let checkNumber = await client.onWhatsApp(number + "@s.whatsapp.net");
    if (!checkNumber.length) return m.reply("Invalid number!");

    owner.push(number);
    Premium.push(number);
    fs.writeFileSync('./function/owner.json', JSON.stringify(owner));
    fs.writeFileSync('./function/premium.json', JSON.stringify(Premium));

    m.reply("Owner added successfully.");
}
break;

case 'delowner': case 'delown': {
    if (!isCreator) return m.reply("Owner only.");
    if (!args[0]) return m.reply(`Usage: ${command} 62xxx`);

    let number = qtext.replace(/[^0-9]/g, '');
    owner.splice(owner.indexOf(number), 1);
    Premium.splice(Premium.indexOf(number), 1);

    fs.writeFileSync('./function/owner.json', JSON.stringify(owner));
    fs.writeFileSync('./function/premium.json', JSON.stringify(Premium));

    m.reply("Owner removed successfully.");
}
break;

case 'addpremium': case 'addprem': {
    if (!isCreator) return m.reply("Owner only!");
    if (!args[0]) return m.reply(`Usage: ${prefix + command} 62xxx`);

    let number = qtext.split("|")[0].replace(/[^0-9]/g, '');
    let ceknum = await client.onWhatsApp(number + "@s.whatsapp.net");
    if (!ceknum.length) return m.reply("Invalid number!");

    Premium.push(number);
    fs.writeFileSync('./function/premium.json', JSON.stringify(Premium));

    m.reply("Success! User added to premium.");
}
break;

case 'delpremium': case 'delprem': {
    if (!isCreator) return m.reply("Owner only!");
    if (!args[0]) return m.reply(`Usage: ${prefix + command} 62xxx`);

    let number = qtext.split("|")[0].replace(/[^0-9]/g, '');
    let indexPremium = Premium.indexOf(number);

    if (indexPremium !== -1) {
        Premium.splice(indexPremium, 1);
        fs.writeFileSync('./function/premium.json', JSON.stringify(Premium));
        m.reply("Success! User removed from premium.");
    } else {
        m.reply("User is not in the premium list.");
    }
}
break;

case 'public': {
    if (!isCreator) return m.reply("Owner only.");
    client.public = true;
    m.reply("Bot set to public mode.");
}
break;

case 'private': case 'self': {
    if (!isCreator) return m.reply("Owner only.");
    client.public = false;
    m.reply("Bot set to private mode.");
}
break;

default:
if (budy.startsWith('<')) {
if (!isCreator) return;
function Return(sul) {
sat = JSON.stringify(sul, null, 2)
bang = util.format(sat)
if (sat == undefined) {
bang = util.format(sul)}
return m.reply(bang)}
try {
m.reply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
} catch (e) {
m.reply(String(e))}}
if (budy.startsWith('>')) {
if (!isCreator) return;
try {
let evaled = await eval(budy.slice(2))
if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
await m.reply(evaled)
} catch (err) {
await m.reply(String(err))
}
}
if (budy.startsWith('$')) {
if (!isCreator) return;
require("child_process").exec(budy.slice(2), (err, stdout) => {
if (err) return m.reply(`${err}`)
if (stdout) return m.reply(stdout)
})
}
}
} catch (err) {
console.log(require("util").format(err));
}
}
let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
require('fs').unwatchFile(file)
console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
delete require.cache[file]
require(file)
})