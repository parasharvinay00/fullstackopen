const PersonForm = ({
  addPerson,
  newName,
  newNumber,
  newAddress,
  handleNameChange,
  handleNumberChange,
  handleAddressChange
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name:{' '}
        <input
          value={newName}
          onChange={handleNameChange}
        />
      </div>

      <div>
        number:{' '}
        <input
          value={newNumber}
          onChange={handleNumberChange}
        />
      </div>

      <div>
        address:{' '}
        <input
          value={newAddress}
          onChange={handleAddressChange}
        />
      </div>

      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm
