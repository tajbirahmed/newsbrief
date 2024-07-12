import { useScreen } from '@/contexts/ScreenContext'
import { Slot } from 'expo-router'
import React, { useEffect } from 'react'

const HeadlineLayout = () => {
  const {
    screen,
    setScreen
  } = useScreen(); 
  useEffect(() => { 
    setScreen('Headline'); 
  }, [])
  return (
    <Slot />
  )
}

export default HeadlineLayout