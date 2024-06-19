import ReactDOM from 'react-dom/client'
// import ReactDOM from 'react-dom'
import React from 'react'
import App from './App'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root'))
.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>
)