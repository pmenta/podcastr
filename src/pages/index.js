import { api } from '../services/api'

import Image from 'next/image'

import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { convertDurationToTimeDescription } from '../utils/convertDurationToTimeString'

import styles from './home.module.scss'

export default function Home({latestEpisodes}) {
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image
                  width={192} 
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title} 
                />


                <div className={styles.episodeDetails}>
                  <a href='#'>{episode.title}</a>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type='button'>
                  <img src='/play-green.svg' alt='Tocar'/>
                </button>

              </li>
            )
          })}
        </ul>
      </section>
      <section className='allEpisodes'>

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
        file: episode.file.url,
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
