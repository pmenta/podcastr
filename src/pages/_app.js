import '../styles/global.scss'

import { Header } from '../components/Header'
import { Player } from '../components/Player'
import { PlayerContext } from '../contexts/PlayerContext'

import styles from '../styles/app.module.scss'
import { useState } from 'react'


function MyApp({ Component, pageProps }) {
  
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  const [isDark, setIsDark] = useState(false)

  function toggleDarkMode() {
    setIsDark(!isDark)
  }

  function play(episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function togglePlay() {
    setIsPlaying(!isPlaying)
  }

  function toggleLoop() {
    setIsLooping(!isLooping)
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling)
  }

  function playList(list, index) {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  } 

  function setPlayingState(state) {
    setIsPlaying(state)
  }

  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length
  const hasPrevious = currentEpisodeIndex > 0


  function playNext() {
    if (isShuffling) { 
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
      setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  function playPrevious() {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }

  }

  function clearPlayerState() {
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }



  return (
    <PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, play, isPlaying, isShuffling,isLooping, togglePlay,toggleShuffle ,setPlayingState, playList, playNext, playPrevious, hasNext, hasPrevious, toggleLoop, clearPlayerState, isDark, toggleDarkMode }}>
      <div className={styles.wrapper}>
        <main style={isDark ? {backgroundColor: '#44475a', transition: 'All Ease 0.3s'} : {backgroundColor: '#F7F8FA', transition: 'All Ease 0.3s'}}>
          <Header></Header>
          <Component {...pageProps} />
        </main>
        <Player/>
      </div>
    </PlayerContext.Provider>
  )
}

export default MyApp
