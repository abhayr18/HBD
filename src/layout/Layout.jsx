import React from 'react'
import { Outlet } from 'react-router'
import HeartTransition from '../components/HeartTransition'
import MusicPlayer from '../components/MusicPlayer'
import StardustCursor from '../components/StardustCursor'
import FireworksCanvas from '../components/FireworksCanvas'
import CandleRitualModal from '../components/CandleRitualModal'
import LoveCapsuleModal from '../components/LoveCapsuleModal'
import SendKiss from '../components/SendKiss'

const Layout = () => {
  return (
    <>
      <FireworksCanvas />
      <StardustCursor />
      <MusicPlayer />
      <SendKiss recipientName="Doctor Saheba" />
      <CandleRitualModal recipientName="Doctor Saheba" senderName="Om" />
      <LoveCapsuleModal />
      <HeartTransition />
      <Outlet />
    </>
  )
}

export default Layout