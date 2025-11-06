import React, { useState } from 'react';

function Option() {
  const [options, setOptions] = useState([
    { id: 1, name: 'Private Pickup', price: 25 },
    { id: 2, name: 'Lunch Upgrade', price: 15 },
  ]);
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div>
      <h3>Options</h3>
      <ul>
        {options.map(o => (
          <li key={o.id}>
            <label>
              <input
                type="checkbox"
                checked={selected.includes(o.id)}
                onChange={() => toggle(o.id)}
              />
              {o.name} (+${o.price})
            </label>
          </li>
        ))}
      </ul>
      <p>Selected: {selected.join(', ') || 'none'}</p>
    </div>
  );
}

export default Option;
