import React from "react"
import { Outlet } from "react-router"

const Index = () => {
    return (
        <div>
            <h1>Layout Header</h1>
            <Outlet />
        </div>
    )
}

export default Index
