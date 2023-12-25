import React from "react"
import { useParams, useRouteError } from "react-router";
import { Outlet } from "react-router-dom"

const Examples = () => {
    const params = useParams()
    return (
        <div>Examples
            {params['*']}
        </div>
    )
}

export default Examples