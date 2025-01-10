import { Grid, Modal, TextInput, Button, Container, Select} from '@mantine/core';
import { useState, useEffect } from 'react';



const gameData = [
    {value: 'rby', label: 'Pokemon Red/Blue/Green', abbr: 'RBG', zoom: 0.8, path: 'versions.generation-i.red-blue.front_default'},
    {value: 'ylw', label: 'Pokemon Yellow', abbr: 'Yellow', zoom: 0.8},
    {value: 'gsc', label: 'Pokemon Gold/Silver', abbr: 'GS', zoom: 0.6},
    {value: 'cry', label: 'Pokemon Crystal', abbr: 'Crystal', zoom: 0.6},
    {value: 'rse', label: 'Pokemon Ruby/Sapphire', abbr: 'RS', zoom: 0.8},
    {value: 'emr', label: 'Pokemon Emerald', abbr: 'Emerald', 'zoom': 0.8},
    {value: 'frlg', label: 'Pokemon FireRed/LeafGreen', abbr: 'FRLG', 'zoom': 0.8},
    {value: 'dpp', label: 'Pokemon Diamond/Pearl', abbr: 'DP', zoom: 1},
    {value: 'plat', label: 'Pokemon Platinum', abbr: 'Platinum', zoom: 1},
    {value: 'hgss', label: 'Pokemon HeartGold/SoulSilver', abbr: 'HGSS', zoom: 1},
    {value: 'bw', label: 'Pokemon Black/White', abbr: 'BW', zoom: 1},
    {value: 'b2w2', label: 'Pokemon Black 2/White 2', abbr: 'B2W2', zoom: 1},
    {value: 'xy', label: 'Pokemon X/Y', abbr: 'XY', zoom: 0.8},
    {value: 'oras', label: 'Pokemon Omega Ruby/Alpha Sapphire', abbr: 'ORAS', zoom: 1},
    {value: 'sm', label: 'Pokemon Sun/Moon', abbr: 'SM', zoom: 1.2},
    {value: 'usum', label: 'Pokemon Ultra Sun/Ultra Moon', abbr: 'USUM', zoom: 1.2},
    {value: 'lgpe', label: "Pokemon Let's Go Pikachu/Eevee", abbr: 'LGPE', zoom: 1},
    {value: 'ss', label: 'Pokemon Sword/Shield', abbr: 'SWSH', zoom: 1},
    {value: 'bdsp', label: 'Pokemon Brilliant Diamond/Shining Pearl', abbr: 'BDSP', zoom: 1},
    {value: 'pla', label: 'Pokemon Legends Arceus', abbr: 'PLA', zoom: 1},
    {value: 'sv', label: 'Pokemon Scarlet/Violet', abbr: 'SV', zoom: 1},
    {value: 'za', label: 'Pokemon Legends: Z-A', abbr: 'Legends Z-A', zoom: 1},
    {value: 'pogo', label: 'Pokemon GO', abbr: 'POGO', zoom: 1},
    {value: 'sleep', label: 'Pokemon Sleep', abbr: 'Sleep', zoom: 1},
    {value: 'col', label: 'Pokemon Colosseum', abbr: 'Colosseum', zoom: 1},
    {value: 'xd', label: 'Pokemon XD: Gale of Darkness', abbr: 'XD', zoom: 1},
    {value: 'pmdx', label: 'Pokemon Mystery Dungeon: Rescue Team DX', abbr: 'PMDX', zoom: 1},
    {value: 'rum', label: 'Pokemon Rumble', abbr: 'Rumble', zoom: 1}
]

const getSpritePath = (pokemon, value) => { 
    switch (value) {
        case 'rby':
            return pokemon.sprites.versions['generation-i']['red-blue'].front_default
        case 'gsc':
            return pokemon.sprites.versions['generation-ii']['gold'].front_shiny
        case 'rse':
            return pokemon.sprites.versions['generation-iii']['ruby-sapphire'].front_shiny
        case 'dpp':
            return pokemon.sprites.versions['generation-iv']['diamond-pearl'].front_shiny
        case 'bw':
        case 'b2w2':
            return pokemon.sprites.versions['generation-v']['black-white'].front_shiny
        case 'xy':
            return pokemon.sprites.versions['generation-vi']['x-y'].front_shiny
        case 'sm':
        case 'usum':
            return pokemon.sprites.versions['generation-vii']['ultra-sun-ultra-moon'].front_shiny
        case 'lgpe':
        case 'ss':
        case 'sv':
        case 'bdsp':
        case 'pla':
            return pokemon.sprites['other']['home'].front_shiny
        case 'ylw': 
            return pokemon.sprites.versions['generation-i']['yellow'].front_default
        case 'cry': 
            return pokemon.sprites.versions['generation-ii']['crystal'].front_shiny
        case 'emr':
            return pokemon.sprites.versions['generation-iii']['emerald'].front_shiny
        case 'frlg':
            return pokemon.sprites.versions['generation-iii']['firered-leafgreen'].front_shiny
        case 'plat':
            return pokemon.sprites.versions['generation-iv']['platinum'].front_shiny
        case 'hgss': 
            return pokemon.sprites.versions['generation-iv']['heartgold-soulsilver'].front_shiny
        case 'oras':
            return pokemon.sprites.versions['generation-vi']['omegaruby-alphasapphire'].front_shiny
        default:
            return pokemon.sprites['other']['home'].front_shiny
    } 
}

const getNestedValue = (obj, path) => {
  console.log(path.split('.').reduce((current, key) => current?.[key], obj))
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

function TestGrid() {
  const [cells, setCells] = useState(() => {
    const savedCells = localStorage.getItem('pokemonBingoCells');
    return savedCells ? JSON.parse(savedCells) : Array(25).fill({ name: '', sprite: '', customText: '', generation: ''});
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [customText, setCustomText] = useState('');
  const [generation, setGeneration] = useState('');
  const [currentPokemonData, setCurrentPokemonData] = useState([]);
  const [isSearchable, setIsSearchable] = useState(false);

  const setGamesSprites = async (spritePath) => {
    try {
        const response = await fetch(`/api/pokemon/search/${spritePath}`)
        const data = await response.json()
        setCurrentPokemonData(data)
        setIsLoading(false)
    } catch (error) {
        console.error('Error fetching Pokemon:', error)
        setIsLoading(false)
    }
  }

  useEffect(() => {
    localStorage.setItem('pokemonBingoCells', JSON.stringify(cells));
  }, [cells]);

useEffect(() => {
  if (editingIndex !== null) {  
    const timer = setTimeout(() => {
      setIsSearchable(true);
    }, 300); 
    return () => clearTimeout(timer);
  } else {  
    setIsSearchable(false);
  }
}, [editingIndex]);

  const enrichPokemon = async (id) => {
    try {
        const response = await fetch(`/api/pokemon/${id}`)
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching Pokemon:', error)
    }
  }

  const handleCellChange = async (index, pokemon) => {
    const newCells = [...cells];
    const pokemonData = await enrichPokemon(pokemon.id)
    console.log(pokemonData)
    newCells[index] = { 
      name: pokemon.name, 
      sprite: getNestedValue(pokemonData.sprites, gameData.find(g => g.value = generation).path),
      customText: customText,
      generation: generation
    };
    setCells(newCells);
    setEditingIndex(null);
    setSearchValue('');
    setCustomText('');
    setGeneration('');
  };

  return (
    <Container size="sm">
      <Grid columns={5} style={{ maxWidth: '500px', margin: 'auto' }}>
        <Grid.Col span={1} style={headerStyle}>B</Grid.Col>
        <Grid.Col span={1} style={headerStyle}>I</Grid.Col>
        <Grid.Col span={1} style={headerStyle}>N</Grid.Col>
        <Grid.Col span={1} style={headerStyle}>G</Grid.Col>
        <Grid.Col span={1} style={headerStyle}>O</Grid.Col>

        {cells.map((cell, index) => (
          <Grid.Col key={index} span={1} className="cell" style={cellStyle} onClick={() => {
            setEditingIndex(index);
            if (cells[index].name) {
              setSearchValue(capitalize(cells[index].name));
              setGeneration(cells[index].generation);
              setCustomText(cells[index].customText);
            } else {
              setSearchValue('');
              setGeneration('');
              setCustomText('');
            }
        }}>
            <div style={cellContainerStyle}>
              {cell.name && (
                <>
                  <img 
                    src={cell.sprite} 
                    alt={cell.name} 
                    style={{ 
                      width: `${110 * (cell.generation ? gameData.find(g => g.value === cell.generation)?.zoom || 1 : 1)}%`, 
                      height: `${110 * (cell.generation ? gameData.find(g => g.value === cell.generation)?.zoom || 1 : 1)}%`,
                      clip: 'auto'
                    }}
                  />
                  <div style={{ 
                    position: 'absolute',
                    bottom: '-5px',
                    left: '0',
                    right: '0',
                    textAlign: 'center',
                    fontSize: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    padding: '0px',
                  }}>
                    {cell.customText || (cell.generation ? gameData.find(g => g.value === cell.generation)?.abbr || '' : '')}
                  </div>
                </>     
              )}
            </div>
          </Grid.Col>
        ))}
      </Grid>

      <Modal.Root opened={editingIndex !== null} onClose={() => {
        setEditingIndex(null);
        if (!cells[editingIndex]?.name) { 
          setGeneration('');
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
            <Select
              placeholder="Choose game..."
              value={generation || (cells[editingIndex]?.generation || '')}
              onChange={(value) => {
                console.log(value)
                setGeneration(value);
                if (value) {
                  setGamesSprites(gameData.find(g => g.value === value).path);
                }
              }}
              data={gameData}
              mb="md"
              clearable
              autoFocus
              required
              searchable={isSearchable}
            />
            <TextInput
              placeholder="Enter custom text (optional)..."
              value={customText || (cells[editingIndex]?.customText || '')}
              onChange={(e) => setCustomText(e.target.value)}
              mb="md"
            />
            <TextInput
              placeholder="Type at least 2 letters to search Pokémon..."
              disabled={!generation}
              value={searchValue || (cells[editingIndex]?.name || '')}
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
    </Container>
  );
}

const headerStyle = {
  backgroundColor: '#2C3E50',
  color: 'white',
  padding: '15px',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: '24px',
  border: '1px solid #34495E',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const cellStyle = {
  backgroundColor: 'white',
  textAlign: 'center',
  border: '1px solid #BDC3C7',
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

function capitalize(str) {
  return str.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-');
}

export default TestGrid;