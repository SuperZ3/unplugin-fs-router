import React from "react"
import { useParams } from "react-router-dom"

export function Pending() {
    return <div>loading</div>
}

const fetcher = async () => {
    return await new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    title: '1',
                    year: '1994'
                },
                {
                    id: 2,
                    title: '2',
                    year: '19945'
                },
                {
                    id: 3,
                    title: '3',
                    year: '1996'
                },
                {
                    id: 4,
                    title: '4',
                    year: '1997'
                }
            ])
        }, 1000)
    })
}

function wrapPromise(promise: Promise<any>) {
    let status: any = 'pending'
    let result: any
    const fetcher = promise.then(
        (r) => {
            status = "success";
            result = r;
          },
          (e) => {
            status = "error";
            result = e;
          }
    )
    return {
        read() {
            switch (status) {
                case 'pending':
                    throw fetcher;
                case 'success':
                    return result;
                case 'error':
                    throw result
            }
        }
    }
}

export default Post

const resource = wrapPromise(fetcher())

function Post() {
    const albums = resource.read()
    return (
      <ul>
        {albums.map((album: any) => (
          <li key={album.id}>
            {album.title} ({album.year})
          </li>
        ))}
      </ul>
    );
}