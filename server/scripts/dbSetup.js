import sqlite3 from 'sqlite3';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sqlite = sqlite3.verbose();

const rpgNames = {
    'nidoran-f': 'nidoranf',
    'nidoran-m': 'nidoranm',
    'mr-mime': 'mrmime',
    'ho-oh': 'hooh',
    'deoxys-normal': 'deoxys',
    'wormadam-plant': 'wormadam',
    'mime-jr': 'mimejr',
    'porygon-z': 'porygonz',
    'giratina-altered': 'giratina',
    'shaymin-land': 'shaymin',
    'basculin-red-striped': 'basculin',
    'darmanitan-standard': 'darmanitan',
    'tornadus-incarnate': 'tornadus',
    'landorus-incarnate': 'landorus',
    'thundurus-incarnate': 'thundurus',
    'keldeo-ordinary': 'keldeo',
    'meloetta-aria': 'meloetta',
    'meowstic-male': 'meowstic',
    'aegislash-shield': 'aegislash',
    'pumpkaboo-average': 'pumpkaboo',
    'gourgeist-average': 'gourgeist',
    'zygarde-50': 'zygarde',
    'oricorio-baile': 'oricorio',
    'lycanroc-midday': 'lycanroc',
    'wishiwashi-solo': 'wishiwashi',
    'type-null': 'typenull',
    'minior-red-meteor': 'minior-meteor',
    'mimikyu-disguised': 'mimikyu',
    'jangmo-o': 'jangmoo',
    'hakamo-o': 'hakamoo',
    'kommo-o': 'kommoo',
    'tapu-koko': 'tapukoko',
    'tapu-lele': 'tapulele',
    'tapu-bulu': 'tapubulu',
    'tapu-fini': 'tapufini',
    'toxtricity-amped': 'toxtricity',
    'mr-rime': 'mrrime',
    'eiscue-ice': 'eiscue',
    'indeedee-male': 'indeedee',
    'morpeko-full-belly': 'morpeko',
    'urshifu-single-strike': 'urshifu',
    'basculegion-male': 'basculegion',
    'enamorus-incarnate': 'enamorus',
    'oinkologne-male': 'oinkologne',
    'maushold-family-of-four': 'maushold-four',
    'squawkabilly-green-plumage': 'squawkabilly',
    'palafin-zero': 'palafin',
    'tatsugiri-curly': 'tatsugiri',
    'dudunsparce-two-segment': 'dudunsparce',
    'great-tusk': 'greattusk',
    'scream-tail': 'screamtail',
    'brute-bonnet': 'brutebonnet',
    'flutter-mane': 'fluttermane',
    'slither-wing': 'slitherwing',
    'sandy-shocks': 'sandyshocks',
    'iron-treads': 'irontreads',
    'iron-bundle': 'ironbundle',
    'iron-hands': 'ironhands',
    'iron-jugulis': 'ironjugulis',
    'iron-moth': 'ironmoth',
    'iron-thorns': 'ironthorns',
    'wo-chien': 'wochien',
    'chien-pao': 'chienpao',
    'ting-lu': 'tinglu',
    'chi-yu': 'chiyu',
    'roaring-moon': 'roaringmoon',
    'iron-valiant': 'ironvaliant',
    'walking-wake': 'walkingwake',
    'iron-leaves': 'ironleaves',
    'gouging-fire': 'gougingfire',
    'raging-bolt': 'ragingbolt',
    'iron-boulder': 'ironboulder',
    'iron-crown': 'ironcrown',
    'basculin-blue-striped': 'basculin-bluestriped',
    'meowstic-female': 'meowstic-f',
    'greninja-battle-bond': 'greninja-ash',
    'necrozma-dusk': 'necrozma-duskmane',
    'necrozma-dawn': 'necrozma-dawnwings',
    'mr-mime-galar': 'mrmime-galar',
    'darmanitan-galar-standard': 'darmanitan-galar',
    'toxtricity-low-key': 'toxtricity-l',
    'eiscue-noice': 'eiscue-n',
    'indeedee-female': 'indeedee-f',
    'zacian-crowned': 'zacian-c',
    'zamazenta-crowned': 'zamazenta-c',
    'urshifu-rapid-strike': 'urshifu-rs',
    'venusaur-gmax': 'venusaur-gigantamax',
    'charizard-gmax': 'charizard-gigantamax',
    'blastoise-gmax': 'blastoise-gigantamax',
    'butterfree-gmax': 'butterfree-gigantamax',
    'pikachu-gmax': 'pikachu-gigantamax',
    'meowth-gmax': 'meowth-gigantamax',
    'machamp-gmax': 'machamp-gigantamax',
    'gengar-gmax': 'gengar-gigantamax',
    'kingler-gmax': 'kingler-gigantamax',
    'lapras-gmax': 'lapras-gigantamax',
    'eevee-gmax': 'eevee-gigantamax',
    'snorlax-gmax': 'snorlax-gigantamax',
    'garbodor-gmax': 'garbodor-gigantamax',
    'melmetal-gmax': 'melmetal-gigantamax',
    'rillaboom-gmax': 'rillaboom-gigantamax',
    'cinderace-gmax': 'cinderace-gigantamax',
    'inteleon-gmax': 'inteleon-gigantamax',
    'corviknight-gmax': 'corviknight-gigantamax',
    'orbeetle-gmax': 'orbeetle-gigantamax',
    'drednaw-gmax': 'drednaw-gigantamax',
    'coalossal-gmax': 'coalossal-gigantamax',
    'flapple-gmax': 'flapple-gigantamax',
    'appletun-gmax': 'appletun-gigantamax',
    'sandaconda-gmax': 'sandaconda-gigantamax',
    'toxtricity-amped-gmax': 'toxtricity-gigantamax',
    'centiskorch-gmax': 'centiskorch-gigantamax',
    'hatterene-gmax': 'hatterene-gigantamax',
    'grimmsnarl-gmax': 'grimmsnarl-gigantamax',
    'alcremie-gmax': 'alcremie-gigantamax',
    'copperajah-gmax': 'copperajah-gigantamax',
    'duraludon-gmax': 'duraludon-gigantamax',
    'urshifu-single-strike-gmax': 'urshifu-ss-gigantamax',
    'urshifu-rapid-strike-gmax': 'urshifu-rs-gigantamax',
    'basculin-white-striped': 'basculin-whitestriped',
    'basculegion-female': 'basculegion-f',
    'tauros-paldea-combat-breed': 'tauros-paldean',
    'tauros-paldea-blaze-breed': 'tauros-blaze',
    'tauros-paldea-aqua-breed': 'tauros-aqua',
    'wooper-paldea': 'wooper-paldean',
    'oinkologne-female': 'oinkologne-f',
    'dudunsparce-three-segment': 'dudunsparce-three',
    'maushold-family-of-three': 'maushold',
    'tatsugiri-stretchy': 'tatsugiri-stretch',
    'squawkabilly-blue-plumage': 'squawkabilly-blue',
    'squawkabilly-yellow-plumage': 'squawkabilly-yellow',
    'squawkabilly-white-plumage': 'squawkabilly-white',
    'frillish-female': 'frillish-f',
    'jellicent-female': 'jellicent-f'
    };

const changeName = (mon) => mon in rpgNames ? rpgNames[mon]: mon

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

async function checkUrl(url) {
    try {
      const response = await fetch(url);
      return response.status !== 404;
    } catch (error) {
      return false;
    }
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
                    const rpgUrl = `https://raw.githubusercontent.com/nerdydrew/Random-Pokemon-Generator/refs/heads/main/public/sprites/shiny/${changeName(pokemon.name)}.webp`
                      checkUrl(rpgUrl).then(exists => {
                        const spritesData = {
                            versions: pokemonData.sprites.versions,
                            other: {
                                home: pokemonData.sprites.other.home,
                                'official-artwork': pokemonData.sprites.other['official-artwork'],
                                'sv-art': exists ? rpgUrl : null
                            }
                        }
                        db.run(
                            'INSERT OR REPLACE INTO pokemon (id, name, sprites) VALUES (?, ?, ?)',
                            [pokemonData.id, pokemonData.name, JSON.stringify(spritesData)],
                            (err) => {
                                if (err) {
                                    console.error(`Error inserting ${pokemon.name}:`, err);
                                } else {
                                    processed++;
                                    console.log(`Processed ${pokemon.name} (${processed}/${pokemonList.length})`);
                                    !exists && console.log("RPG Sprite not found!")
                                }
                                
                                setTimeout(() => processPokemon(index + 1), 100);
                            }
                        );
                    })
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