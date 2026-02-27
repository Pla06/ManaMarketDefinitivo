/**
 * Script para poblar la base de datos con datos iniciales (usuarios,
 * cartas, carritos y pedidos). Se borra el contenido existente y se
 * insertan registros de ejemplo. Útil para desarrollo o pruebas.
 */
const { mongoose, connectDB } = require('./database');
const User = require('./models/user.model');
const Card = require('./models/card.model');
const Cart = require('./models/cart.model');
const Order = require('./models/order.model');

const usersSeed = [
    { name: 'Hector Ruiz', email: 'hector.ruiz@mana.local' },
    { name: 'Laura Gomez', email: 'laura.gomez@mana.local' },
    { name: 'Carlos Perez', email: 'carlos.perez@mana.local' },
    { name: 'Ana Martin', email: 'ana.martin@mana.local' },
    { name: 'Diego Lopez', email: 'diego.lopez@mana.local' }
];

const cardsSeed = [
    { name: 'Lightning Bolt', collection: 'Revised', rarity: 'Common', type: 'Instant', price: 4.5, stock: 30, language: 'EN', condition: 'NM', imageUrl: 'https://m.media-amazon.com/images/I/41kbCXQNryL._AC_UF894,1000_QL80_.jpg' },
    { name: 'Counterspell', collection: 'Ice Age', rarity: 'Common', type: 'Instant', price: 2.2, stock: 40, language: 'EN', condition: 'EX', imageUrl: 'https://i.ebayimg.com/images/g/RHQAAOSwg3li6wzs/s-l1200.jpg' },
    { name: 'Dark Ritual', collection: 'Mirage', rarity: 'Common', type: 'Instant', price: 1.9, stock: 35, language: 'EN', condition: 'NM', imageUrl: 'https://m.media-amazon.com/images/I/41eDZuevMmL._AC_UF894,1000_QL80_.jpg' },
    { name: 'Swords to Plowshares', collection: 'Revised', rarity: 'Uncommon', type: 'Instant', price: 3.8, stock: 24, language: 'EN', condition: 'NM', imageUrl: 'https://m.media-amazon.com/images/I/51ue3R8BIbL.jpg' },
    { name: 'Brainstorm', collection: 'Mercadian Masques', rarity: 'Common', type: 'Instant', price: 1.5, stock: 50, language: 'EN', condition: 'NM', imageUrl: 'https://m.media-amazon.com/images/I/511cCagUfnL._AC_UF894,1000_QL80_.jpg' },
    { name: 'Birds of Paradise', collection: '7th Edition', rarity: 'Rare', type: 'Creature', price: 7.0, stock: 16, language: 'EN', condition: 'EX', imageUrl: 'https://m.media-amazon.com/images/I/51IlW4vm98L._AC_UF894,1000_QL80_.jpg' },
    { name: 'Wrath of God', collection: '10th Edition', rarity: 'Rare', type: 'Sorcery', price: 5.2, stock: 18, language: 'EN', condition: 'NM', imageUrl: 'https://m.media-amazon.com/images/I/41ojSUcjaTL._AC_UF894,1000_QL80_.jpg' },
    { name: 'Serra Angel', collection: 'Revised', rarity: 'Uncommon', type: 'Creature', price: 1.1, stock: 60, language: 'EN', condition: 'LP', imageUrl: 'https://i.ebayimg.com/images/g/by0AAOSwDPta8P0R/s-l400.jpg' },
    { name: 'Shivan Dragon', collection: '4th Edition', rarity: 'Rare', type: 'Creature', price: 2.7, stock: 22, language: 'EN', condition: 'EX', imageUrl: 'https://m.media-amazon.com/images/I/41cHdIuTb-L._AC_UF894,1000_QL80_.jpg' },
    { name: 'Llanowar Elves', collection: 'Dominaria', rarity: 'Common', type: 'Creature', price: 0.6, stock: 120, language: 'EN', condition: 'NM', imageUrl: 'https://m.media-amazon.com/images/I/41dxQWOqB8L._AC_UF894,1000_QL80_.jpg' },
    { name: 'Path to Exile', collection: 'Modern Masters', rarity: 'Uncommon', type: 'Instant', price: 3.3, stock: 25, language: 'EN', condition: 'NM', imageUrl: 'https://gatherer-static.wizards.com/Cards/medium/A6A39994EAEE241AEF64AA1E1BFD926545810A66B70B5B5C2E77E9A578E5C9BA.png' },
    { name: 'Fatal Push', collection: 'Aether Revolt', rarity: 'Uncommon', type: 'Instant', price: 2.9, stock: 28, language: 'EN', condition: 'NM', imageUrl: 'https://assets.moxfield.net/cards/card-EgqVw-normal.webp?278169828' },
    { name: 'Thoughtseize', collection: 'Theros', rarity: 'Rare', type: 'Sorcery', price: 12.5, stock: 14, language: 'EN', condition: 'NM', imageUrl: 'https://assets.moxfield.net/cards/card-EJ3KM-normal.webp?278169976' },
    { name: 'Opt', collection: 'Ixalan', rarity: 'Common', type: 'Instant', price: 0.4, stock: 90, language: 'EN', condition: 'NM', imageUrl: 'https://m.media-amazon.com/images/I/41N9MmUfJVL._AC_UF894,1000_QL80_.jpg' },
    { name: 'Negate', collection: 'Core Set 2020', rarity: 'Common', type: 'Instant', price: 0.3, stock: 100, language: 'EN', condition: 'NM', imageUrl: 'https://assets.moxfield.net/cards/card-NA7rJ-normal.webp?277644145' },
    { name: 'Doom Blade', collection: 'Magic 2012', rarity: 'Uncommon', type: 'Instant', price: 0.8, stock: 48, language: 'EN', condition: 'EX', imageUrl: 'https://assets.moxfield.net/cards/card-EQljB-normal.webp?278213270' },
    { name: 'Duress', collection: 'M19', rarity: 'Common', type: 'Sorcery', price: 0.5, stock: 75, language: 'EN', condition: 'NM', imageUrl: 'https://assets.moxfield.net/cards/card-xR24J-normal.webp?277885710' },
    { name: 'Goblin Guide', collection: 'Zendikar', rarity: 'Rare', type: 'Creature', price: 8.4, stock: 12, language: 'EN', condition: 'NM', imageUrl: 'https://assets.moxfield.net/cards/card-LReKl-normal.webp?278169848' },
    { name: 'Ponder', collection: 'Lorwyn', rarity: 'Common', type: 'Sorcery', price: 2.1, stock: 34, language: 'EN', condition: 'NM', imageUrl: 'https://assets.moxfield.net/cards/card-DAWrp-normal.webp?274840118' },
    { name: 'Arcane Denial', collection: 'Alliances', rarity: 'Common', type: 'Instant', price: 1.2, stock: 41, language: 'EN', condition: 'LP', imageUrl: 'https://assets.moxfield.net/cards/card-PbqV3-normal.webp?264630703' }
];

async function runSeed() {
    try {
        await connectDB();

        await Promise.all([
            Order.deleteMany({}),
            Cart.deleteMany({}),
            User.deleteMany({}),
            Card.deleteMany({})
        ]);

        const users = await User.insertMany(usersSeed);
        const cards = await Card.insertMany(cardsSeed);

        const cartsSeed = [
            {
                userId: users[0]._id,
                items: [
                    { cardId: cards[0]._id, quantity: 2, price: cards[0].price },
                    { cardId: cards[3]._id, quantity: 1, price: cards[3].price }
                ],
                status: 'open'
            },
            {
                userId: users[1]._id,
                items: [
                    { cardId: cards[10]._id, quantity: 1, price: cards[10].price },
                    { cardId: cards[11]._id, quantity: 2, price: cards[11].price }
                ],
                status: 'open'
            },
            {
                userId: users[2]._id,
                items: [
                    { cardId: cards[12]._id, quantity: 1, price: cards[12].price }
                ],
                status: 'closed'
            },
            {
                userId: users[3]._id,
                items: [
                    { cardId: cards[5]._id, quantity: 3, price: cards[5].price }
                ],
                status: 'open'
            },
            {
                userId: users[4]._id,
                items: [
                    { cardId: cards[18]._id, quantity: 2, price: cards[18].price },
                    { cardId: cards[19]._id, quantity: 2, price: cards[19].price }
                ],
                status: 'open'
            }
        ];

        const ordersSeed = [
            {
                userId: users[0]._id,
                items: [
                    { cardId: cards[0]._id, quantity: 2, price: cards[0].price },
                    { cardId: cards[1]._id, quantity: 1, price: cards[1].price }
                ],
                total: 2 * cards[0].price + cards[1].price,
                status: 'paid'
            },
            {
                userId: users[1]._id,
                items: [
                    { cardId: cards[6]._id, quantity: 1, price: cards[6].price }
                ],
                total: cards[6].price,
                status: 'pending'
            },
            {
                userId: users[2]._id,
                items: [
                    { cardId: cards[12]._id, quantity: 1, price: cards[12].price },
                    { cardId: cards[17]._id, quantity: 1, price: cards[17].price }
                ],
                total: cards[12].price + cards[17].price,
                status: 'paid'
            },
            {
                userId: users[3]._id,
                items: [
                    { cardId: cards[9]._id, quantity: 4, price: cards[9].price },
                    { cardId: cards[14]._id, quantity: 2, price: cards[14].price }
                ],
                total: 4 * cards[9].price + 2 * cards[14].price,
                status: 'shipped'
            },
            {
                userId: users[4]._id,
                items: [
                    { cardId: cards[10]._id, quantity: 2, price: cards[10].price },
                    { cardId: cards[18]._id, quantity: 1, price: cards[18].price }
                ],
                total: 2 * cards[10].price + cards[18].price,
                status: 'pending'
            }
        ];

        const carts = await Cart.insertMany(cartsSeed);
        const orders = await Order.insertMany(ordersSeed);

        console.log('Seed completado correctamente:');
        console.log(`- Users: ${users.length}`);
        console.log(`- Cards: ${cards.length}`);
        console.log(`- Carts: ${carts.length}`);
        console.log(`- Orders: ${orders.length}`);
        console.log(`- Total registros: ${users.length + cards.length + carts.length + orders.length}`);
    } catch (error) {
        console.error('Error ejecutando seed:', error.message);
        console.error('Si usas Atlas, añade tu IP en Network Access o define MONGODB_URI en backend/.env para usar otra base de datos.');
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

runSeed();
