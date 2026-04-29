import { useEffect, useState } from 'react'

function App() {
  const [msg, setMsg] = useState('loading...')

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => setMsg(data.message))
      .catch(() => setMsg('error'))
  }, [])

  return <h1>{msg}</h1>
}

export default App
