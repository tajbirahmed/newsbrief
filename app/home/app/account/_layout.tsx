import { useScreen } from '@/contexts/ScreenContext';
import { Slot } from 'expo-router'
import React, { useEffect } from 'react'

const Account = () => {

	const {
		screen,
		setScreen
	} = useScreen();

	useEffect(() => {
		setScreen("Account");
	}, []);
	useEffect(() => {

	}, [])
	return (
		
			<Slot />
		
	)
}

export default Account