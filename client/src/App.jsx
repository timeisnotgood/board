import React from 'react'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import Dashboard from './container/home/index'
import { Login } from './container/login'
import Board from './container/board/Board'
import  {Signup}  from './container/Signup'

const App = () => {
  return (
    <Routes>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/board' element={<Board/>}/>
    </Routes>
  )
}

export default App