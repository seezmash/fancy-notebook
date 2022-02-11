import Link from 'next/link'

const NoteMenu = ({
  state_notes = [],
  state_currentNote,
  state_currentFolder,
  handleNoteClick,
  submitAddNoteForm,
  deleteSelectedNote,
  renameSelectedNote,
  mainEditor
}) => {
  let currentNoteId = state_currentNote ? state_currentNote.id : null
  let currentFolderId = state_currentFolder ? state_currentFolder.id : null
  let currentNoteName = state_currentNote ? state_currentNote.title : null
  return (
    <div className="h-80F relative mb-10 ml-4 table w-60">
      <div className="border-bF mb-6 w-full px-3 text-sm font-semibold text-gray-600">
        {/* <div className="mr-3 inline-block h-5 w-5 align-middle">
          <img
            src="./icons/text_snippet_black_24dp.svg"
            className="h-full w-full"
          />
        </div> */}
        <div className="relative inline-block select-none align-middle">
          Notes
        </div>
      </div>
      <div className="borderF relative h-full w-full overflow-hidden rounded-md bg-white shadow">
        {state_notes.map((item, index) => {
          let itemClass =
            item.id === currentNoteId ? ' selected_note' : 'text-gray-600'

          return (
            <div
              key={'shortid_' + index}
              className={
                'w-full cursor-pointer border-b border-gray-100 p-1 text-sm font-semibold hover:bg-gray-50'
              }
              onClick={() => {
                handleNoteClick(
                  state_notes,
                  currentFolderId,
                  item.id,
                  index,
                  mainEditor
                )
              }}
            >
              <div className={'h-full w-full rounded-md p-2 ' + itemClass}>
                {item.title}
              </div>
            </div>
          )
        })}
        {/* <div className="m-1 mt-6 flex h-10 cursor-pointer rounded-md hover:bg-gray-50">
          <div className="relative top-2.5 ml-2 inline-block flex-grow text-sm font-semibold text-gray-600">
            New note
          </div>
          <img
            src="./icons/plus.svg"
            className="relative top-2 ml-3 mr-2 inline-block h-6 w-6"
            alt="plus-icon"
          />
        </div> */}
      </div>
      <form
        id="add_note_form"
        className="mt-10 rounded bg-gray-100 p-4"
        onSubmit={(e) => {
          submitAddNoteForm(e, state_currentFolder)
        }}
      >
        <label htmlFor="title" className="text-sm font-semibold text-gray-600">
          Title:
        </label>
        <input type="text" className="mt-3 rounded" name="title" required />
        <button className="mt-4 rounded bg-gray-200 px-2 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-300">
          Add new note
        </button>
      </form>
      <form
        id="rename_note_form"
        className="mt-6 rounded bg-gray-100 p-4"
        onSubmit={(e) => {
          renameSelectedNote(e, currentFolderId, currentNoteId)
        }}
      >
        <label htmlFor="title" className="text-sm font-semibold text-gray-600">
          Note: <span className="ml-1">{currentNoteName}</span>
        </label>
        <input type="text" className="mt-3 rounded" name="title" required />
        <button className="ml-4F mt-4 rounded bg-gray-200 px-2 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-300">
          Rename note
        </button>
      </form>
      <div className="mt-6 bg-red-50 p-4">
        <div className="px-2 pb-1 text-sm font-semibold text-red-600">
          Note: <span className="ml-1">{currentNoteName}</span>
        </div>
        <button
          onClick={(e) => {
            deleteSelectedNote(e, currentFolderId, currentNoteId)
          }}
          className="mt-3 rounded bg-red-100 px-2 py-2 text-sm font-semibold text-red-600 hover:bg-red-300"
        >
          Delete selected note
        </button>
      </div>
    </div>
  )
}

export default NoteMenu
