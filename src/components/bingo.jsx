// Main component for bingo board

import { Grid, Modal, TextInput, Button, Container, Select, Flex} from '@mantine/core';
import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { Check, X } from 'lucide-react';


const gameData = [
  {value: 'rby', label: 'Pokemon Red/Blue/Green', abbr: 'RBG', zoom: 1.5, path: 'versions.generation-i.red-blue.front_transparent'},
  {value: 'ylw', label: 'Pokemon Yellow', abbr: 'Yellow', zoom: 1.5, path: 'versions.generation-i.yellow.front_transparent'},
  {value: 'gsc', label: 'Pokemon Gold/Silver', abbr: 'GS', zoom: 0.8, path: 'versions.generation-ii.gold.front_shiny'},
  {value: 'cry', label: 'Pokemon Crystal', abbr: 'Crystal', zoom: 1.5, path: 'versions.generation-ii.crystal.front_shiny_transparent'},
  {value: 'rse', label: 'Pokemon Ruby/Sapphire', abbr: 'RS', zoom: 0.8, path: 'versions.generation-iii.ruby-sapphire.front_shiny'},
  {value: 'emr', label: 'Pokemon Emerald', abbr: 'Emerald', zoom: 0.8, path: 'versions.generation-iii.emerald.front_shiny'},
  {value: 'frlg', label: 'Pokemon FireRed/LeafGreen', abbr: 'FRLG', zoom: 0.8, path: 'versions.generation-iii.firered-leafgreen.front_shiny'},
  {value: 'dpp', label: 'Pokemon Diamond/Pearl', abbr: 'DP', zoom: 1, path: 'versions.generation-iv.diamond-pearl.front_shiny'},
  {value: 'plat', label: 'Pokemon Platinum', abbr: 'Platinum', zoom: 1, path: 'versions.generation-iv.platinum.front_shiny'},
  {value: 'hgss', label: 'Pokemon HeartGold/SoulSilver', abbr: 'HGSS', zoom: 1, path: 'versions.generation-iv.heartgold-soulsilver.front_shiny'},
  {value: 'bw', label: 'Pokemon Black/White', abbr: 'BW', zoom: 1, path: 'versions.generation-v.black-white.front_shiny'},
  {value: 'b2w2', label: 'Pokemon Black 2/White 2', abbr: 'B2W2', zoom: 1, path: 'versions.generation-v.black-white.front_shiny'},
  {value: 'xy', label: 'Pokemon X/Y', abbr: 'XY', zoom: 0.7, path: 'versions.generation-vi.x-y.front_shiny'},
  {value: 'oras', label: 'Pokemon Omega Ruby/Alpha Sapphire', abbr: 'ORAS', zoom: 1, path: 'versions.generation-vi.omegaruby-alphasapphire.front_shiny'},
  {value: 'sm', label: 'Pokemon Sun/Moon', abbr: 'SM', zoom: 1.2, path: 'versions.generation-vii.ultra-sun-ultra-moon.front_shiny'},
  {value: 'usum', label: 'Pokemon Ultra Sun/Ultra Moon', abbr: 'USUM', zoom: 1.2, path: 'versions.generation-vii.ultra-sun-ultra-moon.front_shiny'},
  {value: 'lgpe', label: "Pokemon Let's Go Pikachu/Eevee", abbr: 'LGPE', zoom: 1, path: 'other.sv-art'},
  {value: 'ss', label: 'Pokemon Sword/Shield', abbr: 'SWSH', zoom: 1, path: 'other.sv-art'},
  {value: 'bdsp', label: 'Pokemon Brilliant Diamond/Shining Pearl', abbr: 'BDSP', zoom: 1, path: 'sv-art'},
  {value: 'pla', label: 'Pokemon Legends Arceus', abbr: 'PLA', zoom: 1, path: 'sv-art'},
  {value: 'sv', label: 'Pokemon Scarlet/Violet', abbr: 'SV', zoom: 1, path: 'other.sv-art'},
  {value: 'za', label: 'Pokemon Legends: Z-A', abbr: 'PLZ-A', zoom: 1, path: 'other.sv-art'},
  {value: 'pogo', label: 'Pokemon GO', abbr: 'POGO', zoom: 1, path: 'other.official-artwork.front_shiny'},
  {value: 'sleep', label: 'Pokemon Sleep', abbr: 'Sleep', zoom: 1, path: 'other.official-artwork.front_shiny'},
  {value: 'col', label: 'Pokemon Colosseum', abbr: 'Colosseum', zoom: 1, path: 'other.official-artwork.front_shiny'},
  {value: 'xd', label: 'Pokemon XD: Gale of Darkness', abbr: 'XD', zoom: 1, path: 'other.official-artwork.front_shiny'},
  {value: 'pmdx', label: 'Pokemon Mystery Dungeon: Rescue Team DX', abbr: 'PMDX', zoom: 1, path: 'other.official-artwork.front_shiny'},
  {value: 'rum', label: 'Pokemon Rumble', abbr: 'Rumble', zoom: 1, path: 'other.official-artwork.front_shiny'}
]

// Takes in a json path and an object to get the nested value at the path of the object
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

function BingoBoard() {
  // Saving to local storage
  const [cells, setCells] = useState(() => {
    const savedCells = localStorage.getItem('pokemonBingoCells');
    return savedCells ? JSON.parse(savedCells) : Array(25).fill({ name: '', sprite: '', customText: '', game: '', completed: false});
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [customText, setCustomText] = useState('');
  const [game, setGame] = useState('');
  const [currentPokemonData, setCurrentPokemonData] = useState([]);
  const [isSearchable, setIsSearchable] = useState(false);

  // Function to get all Pokemon that have a sprite at the given sprite path
  const setAvailablePokemon = async (spritePath) => {
    try {
        const response = await fetch(`${API_URL}/api/pokemon/search/${spritePath}`)
        const data = await response.json()
        setCurrentPokemonData(data)
        setIsLoading(false)
    } catch (error) {
        setIsLoading(false)
    }
  }

  // Reload local storage
  useEffect(() => {
    localStorage.setItem('pokemonBingoCells', JSON.stringify(cells));
  }, [cells]);


  // 0.5s delay on the game being searchable, in order to prevent the games appearing before the overall modal
useEffect(() => {
  if (editingIndex !== null) {  
    const timer = setTimeout(() => {
      setIsSearchable(true);
    }, 500); 
    return () => clearTimeout(timer);
  } else {  
    setIsSearchable(false);
  }
}, [editingIndex]);

// Gets all data for Pokemon from given PokeAPI id
  const enrichPokemon = async (id) => {
    try {
        const response = await fetch(`${API_URL}/api/pokemon/${id}`)
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching Pokemon:', error)
    }
  }

  // Function that updates cells on submit
  const handleCellChange = async (index, pokemon) => {
    const newCells = [...cells];
    const pokemonData = await enrichPokemon(pokemon.id)
    newCells[index] = { 
      name: pokemon.name, 
      sprite: getNestedValue(pokemonData.sprites, gameData.find(g => g.value === game).path),
      customText: customText,
      game: game
    };
    setCells(newCells);
    setEditingIndex(null);
    setSearchValue('');
    setCustomText('');
    setGame('');
  };

  // Function that cnofirms and clears all cells
  const handleClearBoard = () => {
    if (window.confirm('Are you sure you want to clear the entire board?')) {
      setCells(Array(25).fill({ name: '', sprite: '', customText: '', game: ''}));
    }
  };

  // Function that marks cell as completed
  const toggleCompleted = (index) => {
    const newCells = [...cells];
    newCells[index] = {
      ...newCells[index],
      completed: !newCells[index].completed
    };
    setCells(newCells);
  };

  // Mantine Grid for Bingo board
  return (
<Container size="sm" style={{ width: '100%', maxWidth: '500px', padding: '0 8px' }}>
<Grid columns={5} style={{ width: '100%', margin: 'auto' }}> 
        <Grid.Col span={1} style={headerStyle}>B</Grid.Col>
        <Grid.Col span={1} style={headerStyle}>I</Grid.Col>
        <Grid.Col span={1} style={headerStyle}>N</Grid.Col>
        <Grid.Col span={1} style={headerStyle}>G</Grid.Col>
        <Grid.Col span={1} style={headerStyle}>O</Grid.Col>
    {/* Fills in local storage data if found, otherwise creates empty cells */}
        {cells.map((cell, index) => (
          <Grid.Col key={index} span={1} className="cell" style={cellStyle} onClick={() => {
            setEditingIndex(index);
            if (cells[index].name) {
              setSearchValue(capitalize(cells[index].name));
              setGame(cells[index].game);
              setCustomText(cells[index].customText);
              setAvailablePokemon(gameData.find(g => g.value === cells[index].game).path);
            } else {
              setSearchValue('');
              setGame('');
              setCustomText('');
            }
        }}>
            <div style={cellContainerStyle}>
              {cell.name && (
                <>
                {/* Sets image of cell and adjusts the zoom based on the game */}
                  <img 
                    src={cell.sprite} 
                    alt={cell.name} 
                    style={{ 
                      maxWidth: `${110 * (cell.game ? gameData.find(g => g.value === cell.game)?.zoom || 1 : 1)}%`, 
                      maxHeight: `${110 * (cell.game ? gameData.find(g => g.value === cell.game)?.zoom || 1 : 1)}%`,
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      clip: 'auto',
                      opacity: cell.completed ? 0.8 : 1  // Add this line
                    }}
                  />
                  {cell.completed && (  // Add this overlay
                    <div style={{
                      position: 'absolute',
                      top: -100,
                      left: -100,
                      right: -100,
                      bottom: -100,
                      backgroundColor: 'rgba(165, 214, 132, 0.2)',
                      // backgroundColor: 'rgba(128, 128, 128, 0.4)',
                      zIndex: 1
                    }}/>
                  )}
                {/* Sets and styles text under the image */}
                  <div style={{ 
                    position: 'absolute',
                    bottom: '-5px',
                    left: '0',
                    right: '0',
                    textAlign: 'center',
                    fontSize: 'clamp(5px, 2.7vw, 16px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    padding: '0px',
                  }}>
                    {cell.customText || (cell.game ? gameData.find(g => g.value === cell.game)?.abbr || '' : '')}
                  </div>
                </>     
              )}
            </div>
          </Grid.Col>
        ))}
      </Grid>

    {/* Modal for selecting Pokemon */}
      <Modal.Root opened={editingIndex !== null} onClose={() => {
        setEditingIndex(null);
        if (!cells[editingIndex]?.name) { 
          setGame('');
          setCustomText('');
          setSearchValue('');
        }
      }} centered>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Select Pokémon</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
          {/* Button to mark pokemon as caught if pokemon is filled in*/}
          {cells[editingIndex]?.name && (
            <Flex justify="center" mb="md">
              <Button
                onClick={() => {
                  toggleCompleted(editingIndex);
                  setEditingIndex(null);
                }}
                variant="filled"
                color={cells[editingIndex]?.completed ? "red" : "teal"}
                size="xs"
              >
                <Flex align="center" gap="xs">
                  {cells[editingIndex]?.completed ? (
                    <X size={16} />) : (<Check size={16} />
                  )}
                  {cells[editingIndex]?.completed ? "Unmark as caught" : "Mark as caught"}
                </Flex>
              </Button>
            </Flex>
          )}
          {/* Select dropdown for choosing game - required for Pokemon search */}
          
            <Select
              maxDropdownHeight={"35vw"}
              comboboxProps={{ position: 'bottom', middlewares: { flip: false, shift: false } }}
              placeholder="Choose game..."
              value={game || (cells[editingIndex]?.game || '')}
              onChange={(value) => {
                setGame(value);
                if (value) {
                  setAvailablePokemon(gameData.find(g => g.value === value).path);
                }
              }}
              data={gameData}
              mb="md"
              clearable
              autoFocus
              required
              searchable={isSearchable}
              allowDeselect={false}
            />
          {/* Optional text input for user to override text in bingo cell */}
            <TextInput
              placeholder="Enter custom text (optional)..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              mb="md"
            />
          {/*  Pokemon search input based on the game chosen */}
            <TextInput
              placeholder="Type at least 2 letters to search Pokémon..."
              disabled={!game}
              value={searchValue}
              onChange={(e) => {
                  setSearchValue(e.target.value);
              }}
              mb="md"
            />
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {isLoading ? (
                <div style={{ textAlign: 'center', color: 'gray' }}>
                  Loading Pokémon...
                </div>
              ) : searchValue.trim().length < 2 ? (
                <div style={{ textAlign: 'center', color: 'gray' }}>
                  Type at least 2 letters to see Pokémon options...
                </div>
              ) : (
                <>
                  {currentPokemonData
                    .filter(pokemon => pokemon.name.toLowerCase().includes(searchValue.toLowerCase()))
                    .map((pokemon) => {
                      return (
                        <Button
                          key={pokemon.name}
                          variant="light"
                          onClick={() => handleCellChange(editingIndex, pokemon)}
                          fullWidth
                          mb="xs"
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center'
                          }}
                        >
                          {capitalize(pokemon.name)}
                        </Button>
                      );
                    })}
                </>
              )}
            </div>  
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      <Flex justify="center" mb="md" style={{marginTop: '1.5rem'}}>

      <Button
        onClick={handleClearBoard}
        variant="light"
        color="red"
        mb="md"
        style={{ float: 'center' }}>
        Clear Board
      </Button>
      </Flex>
    </Container>
  );
}

// Style objects for elements
const headerStyle = {
  backgroundColor: '#e87b58',
  color: 'white',
  padding: '5px',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: '24px',
  border: '2px solid #f2f0ef',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const cellStyle = {
  textAlign: 'center',
  border: '2px solid #f2f0ef',
  fontSize: '18px', 
  transition: 'background-color 0.1s',
  aspectRatio: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  cursor: 'pointer',
};

const cellContainerStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

// Global function for capitalizing Pokemon names
function capitalize(str) {
  return str.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-');
}

export default BingoBoard;