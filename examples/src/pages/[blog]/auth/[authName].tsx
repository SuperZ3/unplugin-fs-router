import React from "react"
import { useLoaderData, useRouteError } from "react-router"
import { useParams } from "react-router-dom"

async function fetchData(params) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!params?.authName || params.authName === 'zhangsan') {
                reject(new Error("can't get content from zhangsan"))
            } else {
                resolve({
                    name: params.authName,
                    blog: params.blog,
                    content: [
                        {
                            title: '1',
                            content: 'first'
                        },
                        {
                            title: '2',
                            content: 'second'
                        }
                    ]
                })
            }
        }, 1000)
    })
}

export function Loader({params}) {
    return fetchData(params)
}

export function Catch() {
    const err = useRouteError()
    return <div>Duang~</div>
}

const Auth = () => {
    const data = useLoaderData() as any
    return (
        <div>
            Auth {data.name}
            <ul>
                {data.content.map((item) => (
                    <li key={item.title}>{item.title}: {item.content}</li>
                ))}
            </ul>
        </div>
    )
}

export default Auth