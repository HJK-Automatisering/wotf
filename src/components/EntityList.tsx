import { useState } from 'react'
import ListHeader from './ListHeader'
import ResultBox from './ResultBox'
import Form from './Form'
import Result from '../types/Result'
import BaseFormData from '../types/entityFormData/BaseFormData'
import BaseEntity from '../types/entities/BaseEntity'
import { IoTrashOutline, IoCheckmark, IoCloseOutline } from 'react-icons/io5'

interface EntityListProps<T extends BaseFormData, U extends BaseEntity<T>> {
  title: string
  fields: { name: string; label: string; type?: string }[]
  utils: {
    getEntities: () => U[]
    handleRemoveAllEntities: {
      handle: () => Result<null>
      safetyMessage: string
    }
    handleSubmitEntity: {
      handle: (data: T) => Result<null>
    }
    handleImportEntities: {
      handle: () => Promise<Result<null>>
      instructionMessage: string
    }
    handleRemoveEntity: {
      handle: (entityId: string) => Result<null>
    }
    handleUpdateEntity: {
      handle: (data: T, entityId: string) => Result<null>
    }
  }
}

export default function EntityList<T extends BaseFormData, U extends BaseEntity<T>>(props: EntityListProps<T, U>) {
  const [hidden, setHidden] = useState<boolean>(false)
  const [addingOpen, setAddingOpen] = useState<boolean>(false)
  const [beingEdited, setBeingEdited] = useState<string[]>([])
  const [result, setResult] = useState<Result<unknown> | null>(null)

  const entityDataMap = props.utils.getEntities().map((entity) => ({
    entity: entity,
    data: entity.toFormData(),
  }))

  function handleRemoveAllEntities() {
    if (!confirm(props.utils.handleRemoveAllEntities.safetyMessage)) return
    setAddingOpen(false)
    setBeingEdited([])
    setResult(props.utils.handleRemoveAllEntities.handle())
  }

  function handleSubmitEntity(data: T) {
    setAddingOpen(false)
    setResult(props.utils.handleSubmitEntity.handle(data))
  }

  function handleCancelAddEntity() {
    setAddingOpen(false)
  }

  function handleToggleHidden() {
    setHidden(!hidden)
  }

  async function handleImportEntities() {
    if (!confirm(props.utils.handleImportEntities.instructionMessage)) return
    setHidden(false)
    setResult(await props.utils.handleImportEntities.handle())
  }

  function handleAddEntity() {
    setHidden(false)
    setAddingOpen(true)
  }

  function handleRemoveEntity(entityId: string) {
    setResult(props.utils.handleRemoveEntity.handle(entityId))
  }

  function handleUpdateEntity(data: T, entityId: string) {
    setBeingEdited(beingEdited.filter((id) => id !== entityId))
    setResult(props.utils.handleUpdateEntity.handle(data, entityId))
  }

  function handleToggleEditEntity(entityId: string) {
    setBeingEdited([...beingEdited, entityId])
  }

  function handleCancelUpdateEntity(entityId: string) {
    setBeingEdited(beingEdited.filter((id) => id !== entityId))
  }

  return (
    <div className="flex flex-col w-full space-y-3">
      <ListHeader
        title={props.title}
        buttons={[
          { text: hidden ? 'Vis' : 'Skjul', onClick: handleToggleHidden },
          { text: 'Ryd', onClick: handleRemoveAllEntities },
          { text: 'Importer', onClick: handleImportEntities },
          { text: 'Tilføj', onClick: handleAddEntity },
        ]}
      />
      {!hidden && (
        <>
          <ResultBox result={result} />
          {addingOpen && (
            <div className="bg-white rounded p-2 shadow">
              <Form<T>
                fields={props.fields}
                onSubmit={handleSubmitEntity}
                onCancel={handleCancelAddEntity}
                submitIcon={<IoCheckmark />}
                cancelIcon={<IoCloseOutline />}
              />
            </div>
          )}
          {entityDataMap.length > 0 && (
            <div className="cus-container">
              {entityDataMap.map((mapping, idx) => (
                <div key={mapping.entity.id}>
                  {beingEdited.includes(mapping.entity.id) ? (
                    <Form<T>
                      fields={props.fields}
                      initialData={mapping.data}
                      onSubmit={(data) => handleUpdateEntity(data, mapping.entity.id)}
                      onCancel={() => handleCancelUpdateEntity(mapping.entity.id)}
                      submitIcon={<IoCheckmark />}
                      cancelIcon={<IoCloseOutline />}
                    />
                  ) : (
                    <div
                      onClick={() => handleToggleEditEntity(mapping.entity.id)}
                      className="flex hover:bg-slate-100 hover:cursor-pointer px-1 rounded"
                    >
                      <p className="text-sm">{mapping.entity.displayName}</p>
                      <button
                        className="text-slate-400 hover:text-red-500 ml-auto"
                        onClick={() => handleRemoveEntity(mapping.entity.id)}
                      >
                        <IoTrashOutline />
                      </button>
                    </div>
                  )}
                  {idx < entityDataMap.length - 1 && <hr className="my-1" />}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
