import { useState } from 'react';

const Search = ({ persons, setFilteredPersons }) => {
  const [newSearch, setNewSearch] = useState('');

  const inputSearch = (event) => {
    const searchValue = event.target.value;
    setNewSearch(searchValue);
    setFilteredPersons(
      persons.filter((person) =>
        person.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  };

  const searchFormStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  };

  const inputStyle = {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    width: '80%',
  };

  return (
    <form onSubmit={(event) => event.preventDefault()} style={searchFormStyle}>
      <input
        type="text"
        placeholder="Search by name"
        onChange={inputSearch}
        value={newSearch}
        style={inputStyle}
      />
    </form>
  );
};

export default Search;
