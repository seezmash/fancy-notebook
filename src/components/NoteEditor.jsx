import Link from 'next/link'
import Tiptap from './Tiptap'

const NoteEditor = ({ state_currentNote }) => {
  let currentNoteName = state_currentNote ? state_currentNote.title : null

  return (
    <div className="border-rF relative ml-4 h-full w-56 flex-grow">
      <div className="border-bF mb-6 w-full px-3 text-sm font-semibold text-slate-600">
        Editor: <span className="ml-1">{currentNoteName}</span>
      </div>
      <div className="borderF relative h-full w-full overflow-hidden rounded-md bg-white p-3 shadow">
        <Tiptap />
      </div>
    </div>
  )
}

export default NoteEditor
