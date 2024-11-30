import React from 'react'
import { useNavigate } from 'react-router-dom'
import SideMenu from '../Components/SideMenu'
import VideoCall from '../Components/VideoCall'

const Home = () => {

  return (
    <main id='mainBox'>
      <SideMenu/>
      <VideoCall/>
    </main>
  )
}

export default Home