import React from 'react'
import { Route, Routes } from 'react-router-dom'

import {Login} from '../container/login/index'
import {Signup} from '../container/Signup/index'
import Dashboard from '../container/dashboard/index'
import Home from '../container/dashboard/index'
import Board from '../container/board/Board'
import Privateroute from './Privateroute'
import Publicroute from './publicroute'

const Routs = () => {
  return (
    <Routes>
        {/* <Route path="/login" element={<Publicroute element={Login} />} />
        <Route path="/signup" element={<Publicroute element={Signup} />} />
        <Route path="/home" element={<Privateroute element={Home} />} /> */}
        <Route element={<Publicroute/>}>
            <Route path='/login' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
        </Route>
        <Route element={<Privateroute/>}>
            <Route path='/' element={<Dashboard/>}/>
            <Route path='/boards' element={<Board/>}/>
        </Route>
    </Routes>
  )
}

export default Routs;