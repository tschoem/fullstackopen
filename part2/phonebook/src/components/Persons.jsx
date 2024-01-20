const Number = ( props ) =>
  <form onSubmit={props.onSubmit}>
    <b>
      {props.person.name} {props.person.number} <button type="submit">delete</button><br />
    </b>
  </form>

const Persons = ( props ) => {
  return (
    <>
      {props.persons.map((person) => <Number key={person.id} person={person} onSubmit={() => props.deleteHandler(person)}/>) }
    </>
  )
}
  export default Persons