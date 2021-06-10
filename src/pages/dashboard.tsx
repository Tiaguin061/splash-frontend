import styles from '@styles/pages/Home.module.scss'
import Menu from '@components/Menu'
import { useEffect, useState } from 'react'
import api from 'src/services/api'
import { FiChevronRight  } from 'react-icons/fi'
import { format, formatDistance } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { useAuth } from 'src/hooks/useAuth'
import { formatPrice } from 'src/utils/formatPrice'

export default function Home() {
  const {user} = useAuth()

  const [notifications, setNotifications] = useState([])
  const [totalBalance, setTotalBalance] = useState('')
  const [withdrawBalance, setWithdrawBalance] = useState('')

  useEffect(() => {
    api.get('/notifications/sponsorships').then(response => {
        let responseNotifications = response.data
        
        responseNotifications = responseNotifications.map(notification => {
            const {content} = notification
            const newContent = JSON.parse(content.replace("/", ""))

            const parsedDate = formatDistance(new Date(notification.created_at), new Date(), { locale: ptBR })

            return {...notification, content: newContent, created_at: parsedDate}
        })

        setNotifications(responseNotifications)
    })

    api.get('/users/balance-amount').then(response => {
        setTotalBalance(formatPrice(response.data.total_balance))
        setWithdrawBalance(formatPrice(response.data.balance_amount))
    })
  }, [])
  
    return (
    <div className={styles.container}>
        <div className={styles.head}>
            <h1>{totalBalance}</h1>
            <span>{withdrawBalance} disponível para saque</span>
        </div>
        <div className={styles.content}>
            <ul className={styles.userList}>
                { notifications.map(notification => (
                    <li key={notification.id} className={styles.user}>
                        <div className={styles.first}>
                            <div className={styles.img}></div>
                            <div className={styles.text}>
                                <h2>{notification.content.name}</h2>
                                <span>{notification.content.subject}</span>
                            </div>
                        </div>
                        <div className={styles.second}>
                            <a href={`/patrocinios/${notification.content.name}?sender_id=${notification.sender_id}`}>
                                <span>{notification.created_at}</span>
                                <FiChevronRight size={15} color="#8a8a8e" />
                            </a>
                        </div>
                    </li>
                )) }
            </ul>
        </div>
        <Menu page="sponsor" />
    </div>
  )
}
