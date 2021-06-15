import Button from '@components/Button';

import styles from '@styles/pages/loginEmail.module.scss';
import { useRouter } from 'next/router';
import { FormEvent, useContext, useState } from 'react';
import { useAuth } from '../../hooks/useAuth'

import * as yup from 'yup';
import getValidationErrors from 'src/utils/getValidationErrors';

type FormErrors = {
  email?: string
  password?: string 
  invalid?: string
}

export default function LoginEmail() {
  const router = useRouter()
  const {signIn, user} = useAuth()

  const [errors, setErrors] = useState<FormErrors>({} as FormErrors)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

      try {
        const schema = yup.object().shape({
          email: yup.string().email("Digite um email válido").required("Email Obrigatório"),
          password: yup.string().min(8, "Mínimo de 8 caracteres").max(100, "Máximo de 100 caracteres").required("Senha obrigatória")
        });
      
        const data = {
          email,
          password
        }

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({email, password})
    
        router.push('/dashboard')
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          const errs = getValidationErrors(err)

          setErrors(errs)

          return;
        }
        setErrors({invalid: 'E-mail ou senha não estão corretos'})
      }
  }
  
  return (
    <>
      <form className={styles.container} onSubmit={(e) => handleSubmit(e)}>
          <div className={styles.avatar}>
            <img src="/logo.png" alt="Logo" />
          </div>

          <span>Informe seu email e senha</span>
          
          <div className={styles.inputs}>
            <div className={styles.field}>
              <input type="email" required placeholder="Digite seu E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className={styles.field}>
              <input type="password" required placeholder="Digite sua Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
              { errors.password && <div className={[styles.alert, styles.visible].join(" ")}>{errors.password}</div> }
              { errors.invalid && <div className={[styles.alert, styles.visible].join(" ")}>{errors.invalid}</div> }
            </div>
          </div>
          
          <Button type="submit">Entrar</Button>
      </form>

      <div className={styles.links}>
        <span>Ainda não tem uma conta?</span>
        <a>Cadastrar-se</a>
      </div>
    </>
  )
}
