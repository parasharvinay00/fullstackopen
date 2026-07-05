const Note = ({ note, toggleImportance, likeNote }) => {
  const label = note.important 
    ? 'make not important' 
    : 'make important'

  return (
    <li className='note'>
      {note.content} ({note.likes ?? 0} likes)
      <button onClick={likeNote}>like</button>
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}

export default Note
