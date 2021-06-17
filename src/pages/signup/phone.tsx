import Button from '@components/Button';
import Header from '@components/Header';
import styles from '@styles/pages/signUpTelefone.module.scss';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import api from 'src/services/api';
import { withSSRGuest } from 'src/utils/withSSRGuest';


export default function signUpTelefone() {
  const router = useRouter()
  const {sponsorship_code} = router.query

  const [userPhone, setUserPhone] = useState('')
  const [countryCode, setCountryCode] = useState('55')
  
  async function handleSendCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    await api.post(`/users/sms/send-code`, {
      phone_number: `${countryCode}${userPhone}`
    })
    
    router.push({
      pathname: `/signup/verify`,
      query: {
        phoneNumber: `${countryCode}${userPhone}`,
        sponsorship_code,
      }
    })
  }
  
  const phoneValidation = userPhone.length < 8 || userPhone.length > 15
  
  return (
    <>
      <form onSubmit={(e) => handleSendCode(e)} className={styles.container}>
        <Header text="Cadastro" />

          <span>Informe seu número de telefone</span>

          <div className={styles.inputs}>
            <div>
              <h4>BR +55</h4>
              <hr /> 
              <input 
                type="tel" 
                placeholder="Número do telefone" 
                value={userPhone} 
                onChange={(e) => setUserPhone(e.target.value)} />
            </div>
          </div>
          {
            phoneValidation ?
            <Button type="button" style={{fontSize: 12}}>Você precisa informar um número de telefone válido</Button> :
            <Button type="submit">Enviar Código</Button> 
            
          }
          
      </form>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {}
  }
})