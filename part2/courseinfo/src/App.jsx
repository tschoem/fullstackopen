const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <p><b>Total of {sum} exercises </b></p>

const Part = ({ part }) =>
  <p key={part.key}>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) =>
  <>
    {parts.map(part =>
      <Part key={part.id} part={part} />
    )}
  </>

const Course = ({ course }) => {
  const sum = course.parts.reduce((total, part) => {
    console.log(total, part, part.exercises)
    return total + part.exercises
  }, 0
  )

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total sum={sum} />
    </div>
  )
}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
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
        name: 'Reduc',
        exercises: 11,
        id: 4
      }
    ]
  }

  return <Course course={course} />
}


export default App