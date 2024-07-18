import Result, { Status } from '../types/Result'

export default function ResultBox({ result }: { result: Result<unknown> | null }) {
  if (result === null || result.message === '') {
    return null
  }
  return (
    <div className={`p-3 text-white ${result.status === Status.Success ? 'bg-blue-500' : 'bg-red-500'}`}>
      {result.message}
    </div>
  )
}
