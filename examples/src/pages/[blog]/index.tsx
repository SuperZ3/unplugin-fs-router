import React from "react"
import { useRouteError } from "react-router";
import { Outlet } from "react-router-dom"

const Blog = () => {
    return (
        <div>Blog Home
            <Outlet />
        </div>
    )
}

export default Blog