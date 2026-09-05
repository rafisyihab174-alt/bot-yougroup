const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const express = require('express');
const fs = require('fs');
const path = require('path');

// ========== KONFIGURASI ==========
const OWNER_NUMBER = '6289529274658'; // Nomor WA lu
const PREFIX = '!';
const GROUP_DATA_FILE = path.join(__dirname, 'groups.json');

// ========== INISIALISASI ==========
if (!fs.existsSync(GROUP_DATA_FILE)) fs.writeFileSync(GROUP_DATA_FILE, '{}');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// ========== FUNGSI BOT ==========
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth');

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    defaultQueryTimeoutMs: undefined,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, qr } = update;
    if (qr) qrcode.generate(qr, { small: true });
    if (connection === 'close') {
      const shouldReconnect = update.lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Koneksi terputus, menyambung ulang...', shouldReconnect);
      if (shouldReconnect) startBot();
    }
    if (connection === 'open') console.log('✅ BOT YOUGROUP TERHUBUNG!');
  });

  // ========== PESAN MASUK ==========
  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
    const sender = msg.key.participant || from;
    const isOwner = sender.startsWith(OWNER_NUMBER);

    console.log(`📩 Dari ${from}: ${text}`);

    // === !ping ===
    if (text.toLowerCase() === `${PREFIX}ping`) {
      await sock.sendMessage(from, { text: '🏓 PONG! Bot aktif & berjalan!' });
    }

    // === !tambahgrup ===
    if (text.toLowerCase().startsWith(`${PREFIX}tambahgrup`)) {
      const args = text.split(' ').slice(1).join(' ');
      if (!args) return await sock.sendMessage(from, { text: '⚠️ Gunakan: !tambahgrup <link_grup>' });
      
      const groups = JSON.parse(fs.readFileSync(GROUP_DATA_FILE));
      groups[Date.now()] = { link: args, addedBy: sender, addedAt: new Date().toISOString() };
      fs.writeFileSync(GROUP_DATA_FILE, JSON.stringify(groups, null, 2));
      
      await sock.sendMessage(from, { text: '✅ Grup berhasil ditambahkan ke database YouGroup!' });
    }

    // === !daftargrup ===
    if (text.toLowerCase() === `${PREFIX}daftargrup`) {
      const groups = JSON.parse(fs.readFileSync(GROUP_DATA_FILE));
      let list = '📋 DAFTAR GRUP YOUGROUP:\n\n';
      const entries = Object.entries(groups);
      if (entries.length === 0) list += 'Belum ada grup.';
      else entries.forEach(([id, g], i) => list += `${i+1}. ${g.link}\n`);
      await sock.sendMessage(from, { text: list });
    }

    // === !help ===
    if (text.toLowerCase() === `${PREFIX}help`) {
      await sock.sendMessage(from, {
        text: `🤖 *BOT YOUGROUP — KUMPULAN GRUP WA*

Perintah yang tersedia:
${PREFIX}ping — Cek bot aktif
${PREFIX}tambahgrup <link> — Tambah grup ke daftar
${PREFIX}daftargrup — Lihat semua grup
${PREFIX}help — Tampilkan bantuan

💬 Mau bikin web sendiri? Chat Owner!`
      });
    }
  });
}

// ========== WEBSERVER ==========
app.get('/', (req, res) => res.send('🤖 Bot YouGroup — Berjalan Normal!'));
app.listen(PORT, () => console.log(`🌐 Server berjalan di port ${PORT}`));

// ========== MULAI BOT ==========
startBot().catch(console.error);
    }
    if (connection === 'open') console.log('✅ BOT YOUGROUP TERHUBUNG!');
  });

  // ========== PESAN MASUK ==========
  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
    const sender = msg.key.participant || from;
    const isOwner = sender.startsWith(OWNER_NUMBER);

    console.log(`📩 Dari ${from}: ${text}`);

    // === !ping ===
    if (text.toLowerCase() === `${PREFIX}ping`) {
      await sock.sendMessage(from, { text: '🏓 PONG! Bot aktif & berjalan!' });
    }

    // === !tambahgrup ===
    if (text.toLowerCase().startsWith(`${PREFIX}tambahgrup`)) {
      const args = text.split(' ').slice(1).join(' ');
      if (!args) return await sock.sendMessage(from, { text: '⚠️ Gunakan: !tambahgrup <link_grup>' });
      
      const groups = JSON.parse(fs.readFileSync(GROUP_DATA_FILE));
      groups[Date.now()] = { link: args, addedBy: sender, addedAt: new Date().toISOString() };
      fs.writeFileSync(GROUP_DATA_FILE, JSON.stringify(groups, null, 2));
      
      await sock.sendMessage(from, { text: '✅ Grup berhasil ditambahkan ke database YouGroup!' });
    }

    // === !daftargrup ===
    if (text.toLowerCase() === `${PREFIX}daftargrup`) {
      const groups = JSON.parse(fs.readFileSync(GROUP_DATA_FILE));
      let list = '📋 DAFTAR GRUP YOUGROUP:\n\n';
      const entries = Object.entries(groups);
      if (entries.length === 0) list += 'Belum ada grup.';
      else entries.forEach(([id, g], i) => list += `${i+1}. ${g.link}\n`);
      await sock.sendMessage(from, { text: list });
    }

    // === !help ===
    if (text.toLowerCase() === `${PREFIX}help`) {
      await sock.sendMessage(from, {
        text: `🤖 *BOT YOUGROUP — KUMPULAN GRUP WA*

Perintah yang tersedia:
${PREFIX}ping — Cek bot aktif
${PREFIX}tambahgrup <link> — Tambah grup ke daftar
${PREFIX}daftargrup — Lihat semua grup
${PREFIX}help — Tampilkan bantuan

💬 Mau bikin web sendiri? Chat Owner!`
      });
    }
  });
}

// ========== WEBSERVER ==========
app.get('/', (req, res) => res.send('🤖 Bot YouGroup — Berjalan Normal!'));
app.listen(PORT, () => console.log(`🌐 Server berjalan di port ${PORT}`));

// ========== MULAI BOT ==========
startBot().catch(console.error);
