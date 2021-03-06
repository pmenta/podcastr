import { api } from '../services/api'

import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'

import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { convertDurationToTimeDescription } from '../utils/convertDurationToTimeString'

import styles from './home.module.scss'
import { useContext } from 'react'
import { PlayerContext } from '../contexts/PlayerContext'

export default function Home({latestEpisodes, allEpisodes}) {

  const { playList, isDark } = useContext(PlayerContext)

  const episodeList = [...latestEpisodes, ...allEpisodes]


  return (
    <div className={isDark ? styles.homepageDark : styles.homepage}>

      <Head>
        <title>Home | Podcastr</title>
      </Head>


      <section className={isDark ? styles.latestEpisodesDark : styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <img className={styles.latestThumbnails}
                  src={episode.thumbnail} 
                  alt={episode.title} 
                />


                <div className={styles.episodeDetails}>
                  <Link href={`/episode/${episode.id}`}><a>{episode.title}</a></Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type='button' onClick={() => playList(episodeList, index)}>
                  <img src='/play-green.svg' alt='Tocar'/>
                </button>

              </li>
            )
          })}
        </ul>
      </section>
      <section className={isDark ? styles.allEpisodesDark : styles.allEpisodes}>
          <h2>Todos episódios</h2>

          <table cellSpacing={0}> 
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {allEpisodes.map((episode, index) => {
                return (
                  <tr key={episode.id}>
                    <td style={{width: 72}}>
                      <img className={styles.allThumbnails}
                        src={episode.thumbnail}
                        alt={episode.title}
                      />
                    </td>
                    <td>
                    <Link href={`/episode/${episode.id}`}><a>{episode.title}</a></Link>
                    </td>
                    <td>{episode.members}</td>
                    <td style={{width: 80}}>{episode.publishedAt}</td>
                    <td>{episode.durationAsString}</td>
                    <td>
                      <button type='button' onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                        <img src='/play-green.svg' alt='Tocar episódio'></img>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>

          </table>
      </section>
    </div>
  )
}

export async function getStaticProps() {
    const { data } = await api.get('/episodes', {
      params: {
        _limit: 12,
        _sort: 'published_at',
        _order: 'desc'
      }
    })
    
    const episodes = data.map(episode => {
      return {
        id: episode.id,
        title: episode.title,
        members: episode.members,
        publishedAt: format(parseISO(episode.published_at), 'd MMM yy',{locale: ptBR}),
        duration: Number(episode.file.duration),
        durationAsString: convertDurationToTimeDescription(Number(episode.file.duration)),
        description: episode.description,
        url: episode.file.url,
        thumbnail: episode.thumbnail
      }
    })


    const latestEpisodes = episodes.slice(0, 2)
    const allEpisodes = episodes.slice(2, episodes.length)

    return {
      props: {
        latestEpisodes,
        allEpisodes
      },

      revalidate: 60 * 60 * 8
  
    }
  }
