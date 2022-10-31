
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Login from '../Login'
import NotFound from '../NotFound'
import PublicKanban from './PublicKanban'


const PublicHome = ({loginWithGoogle, isAnon}) => 
{

    return (
            <BrowserRouter>
                <Routes>
                    <Route exact path='/' element={
                        <Login loginWithGoogle={loginWithGoogle} signInAnon={isAnon}/>
                    }></Route>

                    <Route path='/public-board/:boardId' element={
                        <PublicKanban />
                    }></Route>
                    
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
    )
}

export default PublicHome