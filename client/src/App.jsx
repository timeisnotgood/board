import React from 'react'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './container/home/Home'
import { Login } from './container/login'
import Board from './container/board/Board'
import  {Signup}  from './container/Signup'

const App = () => {
  return (
    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/board' element={<Board/>}/>
    </Routes>
  )
}

export default App