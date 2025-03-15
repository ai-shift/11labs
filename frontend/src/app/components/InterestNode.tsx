interface InterestNodeProps {
  name: string
  isUser?: boolean
  onClick: () => void
}

export default function InterestNode({ name, isUser = false, onClick }: InterestNodeProps) {
  return (
    <div className={`rounded-full p-2 cursor-pointer ${isUser ? "bg-green-500" : "bg-blue-500"}`} onClick={onClick}>
      <span className="text-white text-sm">{name}</span>
    </div>
  )
}

