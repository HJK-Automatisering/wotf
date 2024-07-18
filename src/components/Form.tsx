import { FormEvent, Fragment } from 'react'
import BaseFormData from '../types/entityFormData/BaseFormData'

interface FormProps<T extends BaseFormData> {
  fields: { name: string; label: string; type?: string; options?: { [key: string]: string } }[]
  initialData?: T
  onSubmit: (data: T) => void
  onCancel: () => void
  submitIcon: JSX.Element
  cancelIcon: JSX.Element
}

export default function Form<T extends BaseFormData>({
  fields,
  initialData,
  onSubmit,
  onCancel,
  submitIcon,
  cancelIcon,
}: FormProps<T>) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries()) as T
    onSubmit(data)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-col grid grid-cols-3 gap-0.5 px-1 py-3 bg-slate-100 items-center border"
    >
      {fields.map((field, idx) => (
        <Fragment key={field.name}>
          <p className="font-bold text-sm">{field.label}:</p>
          <input
            name={field.name}
            defaultValue={initialData?.[field.name] || ''}
            className="border px-1 text-sm"
            type={field.type || 'text'}
            {...(field.options || {})}
            required
          />
          {idx === 0 ? (
            <div className="ml-auto flex space-x-2">
              <button type="submit" className="hover:text-blue-500">
                {submitIcon}
              </button>
              <button type="button" className="hover:text-red-500" onClick={onCancel}>
                {cancelIcon}
              </button>
            </div>
          ) : (
            <div></div>
          )}
        </Fragment>
      ))}
    </form>
  )
}
