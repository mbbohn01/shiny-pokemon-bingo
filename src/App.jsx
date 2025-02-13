// Main app component

import './App.css'
import BingoBoard from './components/bingo'
import Textbox from './components/textbox'
import GitHub from './components/github' 
import { ModalsProvider } from '@mantine/modals'
import { Flex } from '@mantine/core';

// Simple component that renders the bingo board with text boxes to the left and right
function App() {
  return (
  <>
  <GitHub repoUrl="https://github.com/mbbohn01/shiny-pokemon-bingo" />
    <Flex 
      align="center"
      justify="center" 
      style={{ marginTop: '3rem' }}
      px={{ base: '1rem', sm: '2rem', md: '5rem', lg: '10rem' }}
      direction={{ base: 'column', md: 'row' }}
      gap="md"
    >
          <Textbox title = "Instructions"
          text={`To get started, simply click on any cell you'd like to fill! You must choose a game in order to select your Pokemon. The game you choose will determine which sprite is shown. If you'd like to have text other than the game in front of the Pokemon, use the "custom text" field.

    Enjoy!`}/>
          <ModalsProvider>
            <BingoBoard />
          </ModalsProvider>
          <Textbox title = "Notes" 
          text={`• There will only be sprites available for mainline games Gens 1-9. I hope to add support for more sprites in the future.

    • If you come across any bugs, just message "bohn" on Discord`}/>
        </Flex>
    </>
  )
} 

export default App
