import { useState, useEffect } from 'react';
import NumbersList from './components/NumbersList';
import Search from './components/Search';
import phonebookService from './services/phonebook';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  useEffect(() => {
    phonebookService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
      setFilteredPersons(initialPersons);
    });
  }, []);

  const addName = (event) => {
    event.preventDefault();
    const trimmedName = newName.trim();
    const trimmedNumber = newNumber.trim();

    if (trimmedName === '') {
      alert('Name cannot be empty');
      return;
    }
    if (trimmedNumber === '' || isNaN(trimmedNumber)) {
      alert('Number cannot be empty or NaN');
      return;
    }

    const existingPerson = persons.find(
      (person) => person.name === trimmedName
    );

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${trimmedName} is already added to the phonebook, replace the old number with the new one?`
      );
      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: trimmedNumber };
        phonebookService
          .update(existingPerson.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : returnedPerson
              )
            );
            setFilteredPersons(
              filteredPersons.map((person) =>
                person.id !== existingPerson.id ? person : returnedPerson
              )
            );
            setNewName('');
            setNewNumber('');
          });
      }
    } else {
      const newPerson = { name: trimmedName, number: trimmedNumber };
      phonebookService
        .create(newPerson)
        .then((addedPerson) => {
          setPersons([...persons, addedPerson]);
          setFilteredPersons([...persons, addedPerson]);
          setNewName('');
          setNewNumber('');
        })
        .catch((error) => console.error('Error adding person', error));
    }
  };

  const deletePerson = (id) => {
    const person = persons.find((p) => p.id === id);
    const confirmDelete = window.confirm(`Delete ${person.name}?`);

    if (confirmDelete) {
      phonebookService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          setFilteredPersons(
            filteredPersons.filter((person) => person.id !== id)
          );
        })
        .catch((error) => console.error('Error deleting person', error));
    }
  };

  const inputName = (event) => setNewName(event.target.value);
  const inputNumber = (event) => setNewNumber(event.target.value);

  const appStyle = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f7f9fc',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  };

  const inputStyle = {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  };

  const buttonStyle = {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  };

  const titleStyle = {
    color: '#333',
    textAlign: 'center',
  };

  return (
    <div style={appStyle}>
      <h2 style={titleStyle}>Phonebook</h2>
      <Search persons={persons} setFilteredPersons={setFilteredPersons} />
      <form onSubmit={addName} style={formStyle}>
        <div>
          <input
            style={inputStyle}
            placeholder="Enter name"
            onChange={inputName}
            value={newName}
          />
        </div>
        <div>
          <input
            style={inputStyle}
            placeholder="Enter number"
            onChange={inputNumber}
            value={newNumber}
          />
        </div>
        <div>
          <button type="submit" style={buttonStyle}>
            Add
          </button>
        </div>
      </form>
      <h2 style={titleStyle}>Numbers</h2>
      <NumbersList names={filteredPersons} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
