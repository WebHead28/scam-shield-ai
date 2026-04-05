export default function Loader({ text = 'Analyzing...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4 animate-fade-in">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-2 border-cyber-500/20 rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-cyber-400 rounded-full animate-spin" />
        <div className="absolute inset-2 border-2 border-transparent border-b-cyber-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
      </div>
      <p className="text-sm font-mono text-cyber-500 animate-pulse-slow tracking-widest uppercase">{text}</p>
    </div>
  )
}
