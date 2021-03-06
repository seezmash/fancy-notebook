import Link from 'next/link'

const FolderMenu = ({
  state_folders = [],
  state_currentFolder,
  handleFolderClick,
  submitAddFolderForm,
  deleteSelectedFolder,
  renameSelectedFolder,
  mainEditor
}) => {
  let currentFolderId = state_currentFolder ? state_currentFolder.id : null
  let currentFolderName = state_currentFolder ? state_currentFolder.title : null
  return (
    <div className="relative mb-20 table w-48">
      <div className="mb-6 w-full px-3 text-sm font-semibold text-gray-600">
        {/* <div className="mr-3 inline-block h-5 w-5 align-middle">
          <img src="./icons/folder_black_24dp.svg" className="h-full w-full" />
        </div> */}
        <div className="relative inline-block select-none align-middle">
          Folders
        </div>
      </div>
      <div className="bg-gray-50F borderF relative h-full w-full overflow-hidden rounded-md bg-white shadow">
        {state_folders.map((item, index) => {
          // console.log('folder item', item)
          let itemClass =
            item.id === currentFolderId
              ? ' selected_collection'
              : 'text-gray-600'
          return (
            <div
              key={'shortid_' + index}
              className={
                'w-full cursor-pointer border-b border-gray-100 p-1 text-sm font-semibold hover:bg-gray-50'
              }
              onClick={() => {
                handleFolderClick(
                  state_folders,
                  item.id,
                  currentFolderId,
                  index,
                  mainEditor
                )
              }}
            >
              <div className={'h-full w-full rounded-md p-2 ' + itemClass}>
                {item.title}
                <span className="float-right text-gray-400">
                  {/* ({numberOfNotes}) */}
                </span>
              </div>
              {/* <div className=''>num</div> */}
            </div>
          )
        })}
        {/* <div className="m-1 mt-6 flex h-10 cursor-pointer rounded-md hover:bg-gray-50">
          <div className="relative top-2.5 ml-2 inline-block flex-grow text-sm font-semibold text-gray-600">
            New collection
          </div>
          <img
            src="./icons/plus.svg"
            className="bg-gray-200F relative top-2 ml-3 mr-2 inline-block h-6 w-6 rounded-md"
            alt="plus-icon"
          />
        </div> */}
      </div>
      <form
        id="add_folder_form"
        className="mt-10 rounded bg-gray-100 p-4"
        onSubmit={(e) => {
          submitAddFolderForm(e)
        }}
      >
        <label htmlFor="title" className="text-sm font-semibold text-gray-600">
          Title:
        </label>
        <input type="text" className="mt-3 rounded" name="title" required />
        <button className="mt-4 rounded bg-gray-200 px-2 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-300">
          Add new folder
        </button>
      </form>
      <form
        id="rename_folder_form"
        className="mt-6 rounded bg-gray-100 p-4"
        onSubmit={(e) => {
          renameSelectedFolder(e, currentFolderId)
        }}
      >
        <label htmlFor="title" className="text-sm font-semibold text-gray-600">
          Folder: <span className="ml-1">{currentFolderName}</span>
        </label>
        <input type="text" className="mt-3 rounded" name="title" required />
        <button className="ml-4F mt-4 rounded bg-gray-200 px-2 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-300">
          Rename folder
        </button>
      </form>
      <div className="mt-6 bg-red-50 p-4">
        <div className="px-2 pb-1 text-sm font-semibold text-red-600">
          Folder: <span className="ml-1">{currentFolderName}</span>
        </div>
        <button
          onClick={(e) => {
            deleteSelectedFolder(e, currentFolderId)
          }}
          className="mt-3 rounded bg-red-100 px-2 py-2 text-sm font-semibold text-red-600 hover:bg-red-300"
        >
          Delete selected folder
        </button>
      </div>
    </div>
  )
}

export default FolderMenu
