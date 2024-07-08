interface Props {
  title: string
  buttons: Button[]
}

interface Button {
  text: string
  onClick: () => void
}

export default function ListHeader(props: Props) {
  const { title, buttons } = props

  return (
    <div className="flex w-full">
      <h2 className="font-bold text-lg">{title}</h2>
      <div className="flex space-x-3 ml-auto">
        {buttons.map((button, idx) => (
          <button
            key={idx}
            className="w-20 px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded"
            onClick={button.onClick}
          >
            {button.text}
          </button>
        ))}
      </div>
    </div>
  )
}
