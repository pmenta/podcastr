import { createContext } from 'react'

export const PlayerContext = createContext({
    episodeList: [],
    currentEpisodeIndex: 0,
    isPlaying: false,
    togglePlay: () => togglePlay,
    setPlayingState: () => setPlayingState
})

