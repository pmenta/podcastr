import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'

import { useContext } from 'react'

import { PlayerContext } from '../../contexts/PlayerContext'

import {FiMoon, FiSun} from 'react-icons/fi'

import styles from './styles.module.scss'

export function Header() {

    const currentDate = format(new Date(), 'EEEEEE, d MMMM', {locale: ptBR})

    const { isDark, toggleDarkMode } = useContext(PlayerContext)

    return (
        <header className={isDark ? styles.headerContainerDark : styles.headerContainer}>
            <img src='/logo.svg' alt='Podcastr'/>

            <p>O melhor para você ouvir, sempre</p>

            <span>{currentDate}</span>

        <FiMoon size='2rem' className={!isDark ? styles.toggleDark : styles.disabled} onClick={toggleDarkMode}/>
        <FiSun size='2rem' className={isDark ? styles.toggleDark : styles.disabled} onClick={toggleDarkMode}/>
        </header>
    )
}