const Filter = ({ filterText, handleFilterChange }) => {
  return (
    <div>
      filter shown with{' '}
      <input
        value={filterText}
        onChange={handleFilterChange}
      />
    </div>
  )
}

export default Filter