import Button from '@components/Button';
import Header from '@components/Header';

import styles from '@styles/pages/signUpVerification.module.scss';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { useAuth } from 'src/hooks/useAuth';
import api from 'src/services/api';

export default function signUpVerification() {
  const router = useRouter()
  const {saveOnCookies} = useAuth()
  
  const [code, setCode] = useState('')

  console.log(router.query.phoneNumber)
  async function handleSendVerificationCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()


    const response = await api.post(`/users/sms?userPhone=%2B${router.query.phoneNumber}`, {
      code
    })

    saveOnCookies(response.data)
  }
  
  return (
    <>
      <form onSubmit={(e) => handleSendVerificationCode(e)} className={styles.container}>
        <Header text="Verificação"></Header>

          <span>Para finalizar, insira o código de verificação</span>

          <input type="text" placeholder="Código" value={code} onChange={(e) => setCode(e.target.value)}/>

          <Button type="submit" className={styles.confirm}>Confirmar</Button>
      </form>
    </>
  )
}
