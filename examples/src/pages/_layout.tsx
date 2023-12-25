import { useLocale } from "antd/es/locale"
import React from "react"
import { Outlet, useLocation, useNavigate } from "react-router"

const Index = () => {
    const navigate = useNavigate()
    const goBack =() => {navigate(-1)}
    const location = useLocation()
    return (
        <div>
            <h1>Index Layout Header</h1>
            <p>Current: {location.pathname}</p>
            <button onClick={goBack}>{'<'} Back</button>
            <Outlet />
        </div>
    )
}

export default Index
