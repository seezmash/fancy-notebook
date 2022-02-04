import Link from 'next/link'
import React from 'react'
// import { Editor, EditorState } from 'draft-js'
import Tiptap from './Tiptap'

const Footer = () => {
  // const [editorState, setEditorState] = React.useState(() =>
  //   EditorState.createEmpty()
  // )

  return (
    <div className="border-rF relative ml-4 h-full w-56 flex-grow">
      <div className="border-bF mb-6 w-full px-3 text-sm font-semibold text-slate-600">
        Edit: New note
      </div>
      <div className="borderF relative h-full w-full overflow-hidden rounded-md bg-white p-3 shadow">
        <Tiptap />
      </div>
      {/* <Editor editorState={editorState} onChange={setEditorState} /> */}
    </div>
  )
}

export default Footer
