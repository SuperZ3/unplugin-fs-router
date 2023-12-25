import React from "react"
import { Outlet } from "react-router"

const Index = () => {
    return (
        <div>Front Index
            <Outlet />
        </div>
    )
}

export default Index
