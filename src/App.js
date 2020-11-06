import { useState, useEffect } from 'react'
import Navbar from './Navbar'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import './css/App.css'

import AddTemplate from './pages/AddTemplate.jsx'
import GeneratePost from './pages/GeneratePost'
const { ipcRenderer } = require('electron')

const routes = {
  'Add Templates': <AddTemplate />,
  'Generate Post': <GeneratePost />
}

export default function App () {
  const [page, setPage] = useState(null)

  useEffect(() => {
    async function fetchPage () {
      setPage((await ipcRenderer.invoke('getStore', page)).page)
    }

    if (!page) fetchPage()
    else ipcRenderer.invoke('setStore', 'page', page)
  }, [page])

  const route = routes[page] || null
  return (
    <>
      <Navbar routes={routes} setPage={setPage} page={page} />
      <ToastContainer />
      {route}
    </>
  )
}
