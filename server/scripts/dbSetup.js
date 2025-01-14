import sqlite3 from 'sqlite3';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sqlite = sqlite3.verbose();

// Create database
const db = new sqlite.Database(path.join(__dirname, '..', 'pokemon.db'), (err) => {
    if (err) {
        console.error('Error creating database:', err);
        return;
    }
    console.log('Connected to SQLite database');
});

// Create table
db.run(`CREATE TABLE IF NOT EXISTS pokemon (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    sprites TEXT NOT NULL
)`, (err) => {
    if (err) {
        console.error('Error creating table:', err);
        return;
    }
    console.log('Pokemon table created');
    fetchPokemonData();
});

// Get data from PokeAPI
function fetchPokemonData() {
    https.get('https://pokeapi.co/api/v2/pokemon?limit=10000', (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            const pokemonList = JSON.parse(data).results;
            console.log(`Found ${pokemonList.length} Pokemon to process`);
            processPokemonList(pokemonList);
        });

    }).on('error', (err) => {
        console.error('Error fetching Pokemon list:', err);
    });
}

// Unload data into db
function processPokemonList(pokemonList) {
    let processed = 0;
    
    function processPokemon(index) {
        if (index >= pokemonList.length) {
            console.log('All Pokemon processed');
            db.close();
            return;
        }

        const pokemon = pokemonList[index];
        https.get(pokemon.url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const pokemonData = JSON.parse(data);
                    const spritesData = {
                        versions: pokemonData.sprites.versions,
                        other: {
                            home: pokemonData.sprites.other.home,
                            'official-artwork': pokemonData.sprites.other['official-artwork']
                        }
                    };

                    db.run(
                        'INSERT OR REPLACE INTO pokemon (id, name, sprites) VALUES (?, ?, ?)',
                        [pokemonData.id, pokemonData.name, JSON.stringify(spritesData)],
                        (err) => {
                            if (err) {
                                console.error(`Error inserting ${pokemon.name}:`, err);
                            } else {
                                processed++;
                                console.log(`Processed ${pokemon.name} (${processed}/${pokemonList.length})`);
                            }
                            
                            setTimeout(() => processPokemon(index + 1), 100);
                        }
                    );
                } catch (error) {
                    console.error(`Error processing ${pokemon.name}:`, error);
                    setTimeout(() => processPokemon(index + 1), 100);
                }
            });
        }).on('error', (err) => {
            console.error(`Error fetching ${pokemon.name}:`, err);
            setTimeout(() => processPokemon(index + 1), 100);
        });
    }

    processPokemon(0);
}