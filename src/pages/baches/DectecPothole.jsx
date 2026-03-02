import React from 'react'
import { Layout } from '../../layout/Layout'

export const DectecPothole = () => {
  return (
<>
    <Layout>
         <div><h1>Detectar Baches</h1>
    <label htmlFor="file">Sube el archivo</label>
    <input type="file" name="file" id="" />
    <button>Detectar</button>
    </div>
    </Layout>
</>

  )
}
