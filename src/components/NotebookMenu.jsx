import Link from 'next/link'

const FolderMenu = ({
  notebooks = [],
  selectedIndex = 0,
  handleNotebookClick
}) => {
  return (
    <div className="border-rF relative mb-10 table w-48">
      <div className="border-bF mb-6 w-full px-3 text-sm font-semibold text-slate-600">
        Folders
      </div>
      <div className="bg-gray-50F borderF relative h-full w-full overflow-hidden rounded-md bg-white shadow">
        {notebooks.map((item, index) => {
          let itemClass =
            index === selectedIndex ? ' selected_collection' : 'text-slate-600'
          return (
            <div
              key={'shortid_' + index}
              className={
                'w-full cursor-pointer border-b border-slate-100 p-1 text-sm font-semibold hover:bg-slate-50'
              }
              onClick={() => {
                handleNotebookClick(index)
              }}
            >
              <div className={'h-full w-full rounded-md p-2 ' + itemClass}>
                {item.title}
              </div>
            </div>
          )
        })}
        {/* <div className="m-1 mt-6 flex h-10 cursor-pointer rounded-md hover:bg-slate-50">
          <div className="relative top-2.5 ml-2 inline-block flex-grow text-sm font-semibold text-slate-600">
            New collection
          </div>
          <img
            src="./icons/plus.svg"
            className="bg-slate-200F relative top-2 ml-3 mr-2 inline-block h-6 w-6 rounded-md"
            alt="plus-icon"
          />
        </div> */}
      </div>
      <form className="add_notebook mt-10 rounded bg-slate-100 p-4">
        <label htmlFor="title" className="text-sm font-semibold text-slate-600">
          Title:
        </label>
        <input type="text" className="mt-1 rounded" name="title" required />
        <button className="ml-4 mt-3 rounded bg-slate-200 px-2 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-300">
          Add a new folder
        </button>
      </form>
    </div>
  )
}

export default FolderMenu
