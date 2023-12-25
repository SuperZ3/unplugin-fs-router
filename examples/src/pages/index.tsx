import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'
import React from 'react'

export const Catch = () => {
  return <div>Something went wrong... Caught at _app error boundary</div>
}

export const Pending = () => <div>Loading from _app...</div>

export default function App() {
  const navigate = useNavigate()
  const e = () => navigate('/posts/:id/deep', { state: { id: 'e' } })

  return (
    <section style={{ margin: 24 }}>
      <header style={{ display: 'flex', gap: 24 }}>
        <Link to="/">Home</Link>
        <Link to="/Login">Login</Link>
        <Link to={{ pathname: '/subignore/sub' }}>Subignore/sub</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/happy/auth/zhang">auth</Link>
        <Link to="/blog/content">Content</Link>
        <Link to="/blog/content/backend">Content/Backend</Link>
        <Link to="/blog/content/front">Content/Front</Link>
        <Link to="/blog/content/front/React">Content/Front/React</Link>
        <Link to="/blog/post">Pending</Link>
        <Link to="/blog/examples/a/b/c">CatchAll</Link>
        <Link to="/a/b/c/d/">NotFound</Link>
        <button onClick={e}>navigate to</button>
      </header>

      <main>
        <Outlet />
      </main>
    </section>
  )
}

