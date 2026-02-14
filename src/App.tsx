
import './App.css'
import AtivosNaoAtivos from './components/AtivosNaoAtivos.js'
import CorretorasAtivos from './components/CorretorasAtivos.js'

function App() {
  return (
    <div className='bg-gray-100 m-4 p-4'>
      <AtivosNaoAtivos className="mb-4" />
      <CorretorasAtivos />
    </div>
  )
}

export default App
