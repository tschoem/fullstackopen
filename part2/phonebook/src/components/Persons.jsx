const Number = ({ person }) =>
  <b>
    {person.name} {person.number}<br />
  </b>

const Persons = ({ persons }) => 
  <>
    {persons.map((person) => <Number key={person.id} person={person} />)}
  </>

  export default Persons