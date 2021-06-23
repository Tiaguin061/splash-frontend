import styles from '@styles/pages/Home.module.scss'
import Menu from '@components/Menu'
import { useEffect, useState } from 'react'
import api from 'src/services/api'
import { FiChevronRight, FiPower  } from 'react-icons/fi'
import { ImExit  } from 'react-icons/im'
import { format, formatDistance } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { useAuth } from 'src/hooks/useAuth'
import { formatPrice } from 'src/utils/formatPrice'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { withSSRAuth } from 'src/utils/withSSRAuth'

export default function Home() {
  const {user, signOut} = useAuth()
  const router = useRouter()

  const [notifications, setNotifications] = useState([])
  const [totalBalance, setTotalBalance] = useState('')
  const [withdrawBalance, setWithdrawBalance] = useState('')

  useEffect(() => {
    api.get('/notifications/sponsorships').then(response => {
        let responseNotifications = response.data

        responseNotifications = responseNotifications.map(notification => {
            const parsedDate = formatDistance(new Date(notification.created_at), new Date(), { locale: ptBR })

            return {...notification, created_at: parsedDate}
        })

        setNotifications(responseNotifications)
    })

    api.get('/users/balance-amount').then(response => {
        setTotalBalance(formatPrice(response.data.total_balance))
        setWithdrawBalance(formatPrice(response.data.available_for_withdraw))
    })
  }, [])
  
    return (
    <div className={styles.container}>
        <button className={styles.button} onClick={() => {
            signOut()
            router.push('/')
        }}>
            <ImExit size={20} color="#4b4b5c"/>
        </button>
        <div className={styles.head} onClick={() => router.push('/saldo')} >
            <h1>{totalBalance}</h1>
            <span>{withdrawBalance} disponível para saque</span>
        </div>
        <div className={styles.content}>
            <ul className={styles.userList}>
                { notifications.map(notification => (
                <a key={notification.id} href={`/patrocinios/${notification.user.username}?user_id=${notification.user_id}`}>
                    <li className={styles.user}>
                        <div className={styles.first}>
                            <img src={notification.user.avatar_url ? notification.user.avatar_url : 'https://palmbayprep.org/wp-content/uploads/2015/09/user-icon-placeholder.png'}
                                className={styles.img}></img>
                            <div className={styles.text}>
                                <h2>{notification.user.username === user.username ? 'Eu' : notification.user.username}</h2>
                                <span>{notification.content}</span>
                            </div>
                        </div>
                        <div className={styles.second}>
                            <span>{notification.created_at}</span>
                            <FiChevronRight size={15} color="#8a8a8e" />
                        </div>
                    </li>
                </a>
                )) }
            </ul>
        </div>
        <Menu page="sponsor" />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(async (ctx) => {
    return {
      props: {}
    }
})