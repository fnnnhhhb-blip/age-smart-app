const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5180;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

function readData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch {}
  return {};
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET /data/:key — read a key
app.get('/data/:key', (req, res) => {
  const data = readData();
  res.json({ value: data[req.params.key] ?? null });
});

// PUT /data/:key — write a key
app.put('/data/:key', (req, res) => {
  const data = readData();
  data[req.params.key] = req.body.value;
  writeData(data);
  res.json({ ok: true });
});

// GET /data — read all
app.get('/data', (req, res) => {
  res.json(readData());
});

app.listen(PORT, () => {
  console.log(`AgeSmart data server running on http://localhost:${PORT}`);
});
