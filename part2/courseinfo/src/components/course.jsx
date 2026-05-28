const Header = ({ course }) => {
  // This log shows when the header section renders for a specific course.
  console.log('Header: rendering course header', course)

  return (
    // The header displays only the course name.
    <h2>{course.name}</h2>
  )
}

const Part = ({ part }) => {
  // This log shows when an individual part is being rendered.
  console.log('Part: rendering part', part)

  return (
    // Each paragraph prints the part name followed by its exercise count.
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

const Content = ({ parts }) => {
  // This log confirms that the list of parts has reached the Content component.
  console.log('Content: rendering parts list', parts)

  return (
    <div>
      {parts.map(part => {
        // This map iterates through the parts array and turns each part object into a Part component.
        // That lets React render the course content dynamically instead of hardcoding each line.
        console.log('Content: mapping part', {
          id: part.id,
          name: part.name,
          exercises: part.exercises
        })

        // The key identifies each rendered part uniquely, and the part prop passes the part data down.
        return <Part key={part.id} part={part} />
      })}
    </div>
  )
}

const Total = ({ parts }) => {
  // This log marks the start of the total exercise calculation.
  console.log('Total: calculating total for parts', parts)

  // reduce walks through every part and accumulates the total number of exercises.
  // sum is the running total, and each part contributes its exercises value to that total.
  const total = parts.reduce((sum, part) => {
    // This log shows each intermediate step of the reduction process.
    console.log('Total: reduce step', {
      currentSum: sum,
      partName: part.name,
      partExercises: part.exercises
    })
    return sum + part.exercises
  }, 0)

  // This log confirms the final computed total after all parts have been processed.
  console.log('Total: final total', total)

  return (
    // The total is rendered in bold to emphasize the sum of all exercises in the course.
    <strong>
      total of {total} exercises
    </strong>
  )
}

const Course = ({ course }) => {
  // This log shows when the parent course component starts rendering.
  console.log('Course: rendering course component', course)

  return (
    <div>
      {/* Header receives the full course object so it can display the course name. */}
      <Header course={course} />
      {/* Content receives the parts array so it can render every part in the course. */}
      <Content parts={course.parts} />
      {/* Total receives the same parts array so it can calculate and display the total exercises. */}
      <Total parts={course.parts} />
    </div>
  )
}

export default Course
