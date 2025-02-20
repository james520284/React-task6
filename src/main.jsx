import { createRoot } from 'react-dom/client'
import './assets/all.scss'
import { createHashRouter , RouterProvider } from 'react-router'
import routes from './routes'
import { Provider } from 'react-redux'
import store from './redux/store'

const router = createHashRouter(routes);

createRoot(document.getElementById('root')).render(

    <Provider store={store}>
        <RouterProvider router={router}/>
    </Provider>

)
