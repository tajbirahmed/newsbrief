import { DrawerProvider } from '@/contexts/DrawerContext'
import { Slot } from 'expo-router'
import React from 'react'


const HomeLayout = () => {
  return (
    <DrawerProvider>
      <Slot />
    </DrawerProvider>
  )
}

export default HomeLayout