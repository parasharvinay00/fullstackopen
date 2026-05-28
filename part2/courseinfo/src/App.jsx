import Course from './components/course.jsx'

const App = () => {
  // This log marks the moment React starts executing the App component function.
  console.log('App: render started')

  // The courses array is the main application data source.
  // Each course object contains a course name, a unique id, and an array of parts.
  // Each part object stores its own name, exercise count, and id.
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  // This log confirms that the course data has been created and is ready to be rendered.
  console.log('App: courses initialized', courses)

  return (
    <div>
      {courses.map(course => {
        // The map call loops through every course in the array and creates one Course component per item.
        // This is how React renders multiple courses from the shared data structure.
        console.log('App: rendering course', {
          id: course.id,
          name: course.name,
          partsCount: course.parts.length
        })

        // The key helps React track each rendered course efficiently during updates.
        // The course prop passes the full course object to the child component for display.
        return <Course key={course.id} course={course} />
      })}
    </div>
  )
}

export default App
