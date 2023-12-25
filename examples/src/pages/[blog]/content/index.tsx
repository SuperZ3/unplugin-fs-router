import React from "react"
import { Outlet } from "react-router"

const Index = () => {
    return (
        <div>Content
            <Outlet />
        </div>
    )
}

export default Index
