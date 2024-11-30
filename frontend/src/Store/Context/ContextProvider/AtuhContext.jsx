import { useState } from 'react'
import {contextStore} from '../ContextStore'


let AuthContext = ({children}) =>{
    let [user,setUser] = useState(false)
    let login = (data)=>setUser(data)
    let logout = (data)=>setUser(data)

    let values = {
        login,
        user,
        logout
    }

    return (
        <contextStore.Provider value={values}>
            {children}
        </contextStore.Provider>
    )
}

export default AuthContext