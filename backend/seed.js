const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://Mario:<marioyhector>@cluster0.mongodb.net/sample_mflix?retryWrites=true&w=majority'; // Reemplaza <contraseña> con la contraseña de tu usuario de MongoDB Atlas
const client = new MongoClient(uri);

async function seedDatabase() {
  try {
    await client.connect();
    const db = client.db('sample_mflix');

    // Poblar la colección de usuarios
    const usersCollection = db.collection('users');
    await usersCollection.deleteMany({});
    await usersCollection.insertMany([
      { name: 'Hector Ruiz', email: 'hector.ruiz@mana.local' },
      { name: 'Laura Gomez', email: 'laura.gomez@mana.local' },
      { name: 'Carlos Perez', email: 'carlos.perez@mana.local' },
      { name: 'Ana Martin', email: 'ana.martin@mana.local' },
      { name: 'Diego Lopez', email: 'diego.lopez@mana.local' }
    ]);

    // Poblar la colección de cartas
    const cardsCollection = db.collection('movies');
    await cardsCollection.deleteMany({});
    await cardsCollection.insertMany([
      { name: 'Lightning Bolt', collection: 'Revised', rarity: 'Common', type: 'Instant', price: 4.5, stock: 30, language: 'EN', condition: 'NM', imageUrl: 'https://m.media-amazon.com/images/I/41kbCXQNryL._AC_UF894,1000_QL80_.jpg' },
      { name: 'Counterspell', collection: 'Ice Age', rarity: 'Common', type: 'Instant', price: 2.2, stock: 40, language: 'EN', condition: 'EX', imageUrl: 'https://i.ebayimg.com/images/g/RHQAAOSwg3li6wzs/s-l1200.jpg' },
      { name: 'Dark Ritual', collection: 'Mirage', rarity: 'Common', type: 'Instant', price: 1.9, stock: 35, language: 'EN', condition: 'NM', imageUrl: 'https://m.media-amazon.com/images/I/41eDZuevMmL._AC_UF894,1000_QL80_.jpg' },
      { name: 'Swords to Plowshares', collection: 'Revised', rarity: 'Uncommon', type: 'Instant', price: 3.8, stock: 24, language: 'EN', condition: 'NM', imageUrl: 'https://m.media-amazon.com/images/I/51ue3R8BIbL.jpg' },
      { name: 'Brainstorm', collection: 'Mercadian Masques', rarity: 'Common', type: 'Instant', price: 1.5, stock: 50, language: 'EN', condition: 'NM', imageUrl: 'https://m.media-amazon.com/images/I/511cCagUfnL._AC_UF894,1000_QL80_.jpg' },
      { name: 'Birds of Paradise', collection: '7th Edition', rarity: 'Rare', type: 'Creature', price: 7.0, stock: 16, language: 'EN', condition: 'EX', imageUrl: 'https://m.media-amazon.com/images/I/51IlW4vm98L._AC_UF894,1000_QL80_.jpg' },
      { name: 'Wrath of God', collection: '10th Edition', rarity: 'Rare', type: 'Sorcery', price: 5.2, stock: 18, language: 'EN', condition: 'NM', imageUrl: 'https://m.media-amazon.com/images/I/41ojSUcjaTL._AC_UF894,1000_QL80_.jpg' },
      { name: 'Serra Angel', collection: 'Revised', rarity: 'Uncommon', type: 'Creature', price: 1.1, stock: 60, language: 'EN', condition: 'LP', imageUrl: 'https://i.ebayimg.com/images/g/by0AAOSwDPta8P0R/s-l400.jpg' },
      { name: 'Shivan Dragon', collection: '4th Edition', rarity: 'Rare', type: 'Creature', price: 2.7, stock: 22, language: 'EN', condition: 'EX', imageUrl: 'https://m.media-amazon.com/images/I/41cHdIuTb-L._AC_UF894,1000_QL80_.jpg' },
      { name: 'Llanowar Elves', collection: 'Dominaria', rarity: 'Common', type: 'Creature', price: 0.6, stock: 120, language: 'EN', condition: 'NM', imageUrl: 'https://m.media-amazon.com/images/I/41dxQWOqB8L._AC_UF894,1000_QL80_.jpg' }
    ]);

    console.log('Base de datos poblada con éxito.');
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
  } finally {
    await client.close();
  }
}

seedDatabase();
