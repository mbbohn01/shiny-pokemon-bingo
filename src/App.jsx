import { useState } from 'react'
import './App.css'
import BingoBoard from './bingo'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <ModalsProvider>
        <BingoBoard />
      </ModalsProvider>
    </MantineProvider>
  )
}

export default App
