import React from 'react'
import { Layout } from '../../layout/Layout'
import { FaUserShield } from 'react-icons/fa6'

export const Login = () => {
  return (
    <>
    <Layout>
          <div className="flex items-center justify-center bg-[--color-background] px-4">
            <div className="w-full max-w-lg bg-[--color-card] shadow-xl rounded-xl p-4 border border-[--color-border]">
              
              {/* Encabezado */}
              <div className="flex flex-col items-center mb-4">
                <FaUserShield className="text-4xl text-[--color-secondary] mb-2" />
                <h2 className="text-2xl font-bold text-[--color-primary]">
                  Inicio de Sesión
                </h2>
                <p className="text-sm text-gray-500 text-center mt-1">
                  Secretaría de Infraestructura, Comunicaciones y Transportes
                </p>
              </div>
    
              {/* Formulario */}
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[--color-primary] mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="tucorreo@correo.com"
                    className="w-full px-3 py-2 border border-[--color-border] rounded-md focus:outline-none focus:ring-2 focus:ring-[--color-secondary]"
                  />
                </div>
    
                <div>
                  <label className="block text-sm font-medium text-[--color-primary] mb-1">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="********"
                    className="w-full px-3 py-2 border border-[--color-border] rounded-md focus:outline-none focus:ring-2 focus:ring-[--color-secondary]"
                  />
                </div>
                {/* Botón */}
               <div className="flex justify-center">
                 <button
                  type="submit"
                  className="w-4/5 bg-[var(--color-secondary)] cursor-pointer hover:bg-[var(--color-primary)] text-white py-2 rounded-md font-medium transition duration-300 mt-2"
                >
                  Ingresar
                </button>
               </div>
    
              </form>
            </div>
          </div>
        </Layout>
    </>
  )
}
