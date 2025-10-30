// seed.js
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/used_products';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('Connected to MongoDB for seeding'))
  .catch(err => { console.error(err); process.exit(1); });

const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Two tiny placeholder PNGs (1x1) base64 (transparent / light)
const img1Base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";
const img2Base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGP4zwAAAgAB9HFg0wAAAABJRU5ErkJggg==";

const img1Path = path.join(uploadsDir, 'sample1.png'); // transparent
const img2Path = path.join(uploadsDir, 'sample2.png');

fs.writeFileSync(img1Path, Buffer.from(img1Base64, 'base64'));
fs.writeFileSync(img2Path, Buffer.from(img2Base64, 'base64'));

async function seed() {
  try {
    // Remove existing products so seed is idempotent (optional)
    await Product.deleteMany({});
    await Product.create([
      {
        name: 'Used Mobile Phone (Model A)',
        price: 7000,
        description: 'Good working condition. Minor scratches.',
        image: '/uploads/sample1.png'
      },
      {
        name: 'Second-hand Textbook: Data Structures',
        price: 350,
        description: 'Almost like new, no notes.',
        image: '/uploads/sample2.png'
      }
    ]);
    console.log('Seed complete. Inserted sample products.');
  } catch (err) {
    console.error('Seed error', err);
  } finally {
    mongoose.disconnect();
  }
}

seed();
