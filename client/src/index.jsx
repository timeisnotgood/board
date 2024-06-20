// import ReactDOM from 'react-dom/client'
import ReactDOM from 'react-dom'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import store from './redux/Store'

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <App/>
        </Provider>
    </BrowserRouter>,
    document.getElementById('root')
)






//React 18--------

// ReactDOM.createRoot(document.getElementById('root'))
// .render(
//     <BrowserRouter>
//         <App/>
//     </BrowserRouter>
// )
