const NumbersList = ({ names, deletePerson }) => {
  const listStyle = {
    listStyleType: 'none',
    padding: '0',
  };

  const listItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    marginBottom: '8px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
  };

  const deleteButtonStyle = {
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
  };

  if (names.length === 0) {
    return <p>Nothing to show, yet</p>;
  }

  return (
    <ul style={listStyle}>
      {names.map((name) => (
        <li key={name.id} style={listItemStyle}>
          <span>
            {name.name} {name.number}
          </span>
          <button
            onClick={() => deletePerson(name.id)}
            style={deleteButtonStyle}
          >
            delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default NumbersList;
