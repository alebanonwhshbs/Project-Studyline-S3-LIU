import { Link } from 'react-router-dom'

export default function NotFound({ station }) {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div className="animate-rise">
        <svg width="260" height="80" viewBox="0 0 260 80" className="mx-auto" aria-hidden>
          <path d="M10 40 H200" stroke="#E4322B" strokeWidth="10" strokeLinecap="round" />
          <path d="M200 40 H240" stroke="#E4322B" strokeWidth="10" strokeDasharray="6 8" opacity=".4" />
          <line x1="212" y1="18" x2="212" y2="62" stroke="#16161D" strokeWidth="8" strokeLinecap="round" className="dark:stroke-white" />
          {[40, 110].map((x) => <circle key={x} cx={x} cy="40" r="11" fill="#fff" stroke="#16161D" strokeWidth="4" />)}
        </svg>
        <div className="eyebrow mt-6">Error 404</div>
        <h1 className="mt-2 text-5xl font-bold">End of the line.</h1>
        <p className="mx-auto mt-3 max-w-md text-ink-soft dark:text-zinc-400">
          {station ? <>There's no station called <strong className="font-mono">{station}</strong> on this network.</> : "This page isn't on the network."}
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/" className="btn-primary">Back to Home</Link>
          <Link to="/courses" className="btn-ghost">All stations</Link>
        </div>
      </div>
    </div>
  )
}
