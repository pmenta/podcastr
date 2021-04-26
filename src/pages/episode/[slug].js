import Image from 'next/image'
import Head from 'next/head'

import {format, parseISO} from 'date-fns'
import { api } from '../../services/api'
import ptBR from 'date-fns/locale/pt-BR'
import Link from 'next/link'

import styles from './episode.module.scss'

import { convertDurationToTimeDescription } from '../../utils/convertDurationToTimeString'
import { useContext } from 'react'
import { PlayerContext } from '../../contexts/PlayerContext'

export default function episode({ episode }) {

    const { play, isDark } = useContext(PlayerContext)

    return (
        <div className={isDark ? styles.episodeDark : styles.episode }>

            <Head>
                <title>{episode.title} | Podcastr</title>
            </Head>


            <div className={styles.thumbnailContainer}>
                <Link href='/'>
                    <button type='button'>
                        <img src='/arrow-left.svg' alt='Voltar'></img>
                    </button>
                </Link>
                <div className={styles.thumbnailImage} objectFit='cover'>
                    <img src={episode.thumbnail}></img>
                </div>
                <button type='button' onClick={() => play(episode)}>
                    <img src='/play.svg' alt='Tocar episódio'></img>
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div className={styles.description} dangerouslySetInnerHTML={{__html: episode.description}}>
                
            </div>



        </div>
    )
}

export const getStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps = async (context) => {

    const { slug } = context.params

    const { data } = await api.get(`/episodes/${slug}`)

    const episode = {
        id: data.id,
        title: data.title,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy',{locale: ptBR}),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeDescription(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
        thumbnail: data.thumbnail
      }


    return {
        props: {
            episode
        },
        revalidate: 60 * 60 * 24 * 7 * 4 // 1 mês
    }
}