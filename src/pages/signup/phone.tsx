import Button from '@components/Button';
import Header from '@components/Header';

import styles from '@styles/pages/signUpTelefone.module.scss';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import api from 'src/services/api';

export default function signUpTelefone() {
  const router = useRouter()

  const [userPhone, setUserPhone] = useState('')
  
  async function handleSendCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    // await api.post(`/users/sms?userPhone=${userPhone}`)
    
    router.push('/signup/verify')
  }
  
  return (
    <>
      <form onSubmit={(e) => handleSendCode(e)} className={styles.container}>
        <Header text="Cadastro" returnPage="/signup" />

          <span>Lorem ipsum dolor sit amet, consectetur <br/> adipiscing elit ut aliquam</span>

          <div className={styles.inputs}>
            <h4>BR +</h4>
            <input type="number" defaultValue="55"/>
            <input type="tel" placeholder="| Numero do telefone" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} />
          </div>

          <Button type="submit">Enviar Código</Button>
      </form>
    </>
  )
}