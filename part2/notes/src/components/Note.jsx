const Note = (props) => {
  console.log('4. Note received props:', props)

  const { note } = props

  return <li>{note.content}</li>
}

export default Note