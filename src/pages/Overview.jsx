import React, { useState } from 'react';
function PackageTabs({ pkg }) {
  const [tab, setTab] = useState('overview');
  const [selectedOptions, setSelectedOptions] = useState([]);

  function toggleOption(optId) {
    setSelectedOptions(prev => prev.includes(optId) ? prev.filter(x => x !== optId) : [...prev, optId]);
  }
  return (
    <div>
      <div className="tabs">
        <button onClick={() => setTab('overview')} className={tab==='overview'?'active':''}>Overview</button>
        <button onClick={() => setTab('options')} className={tab==='options'?'active':''}>Option</button>
        <button onClick={() => setTab('reviews')} className={tab==='reviews'?'active':''}>Review</button>
      </div>

      <div className="tab-content">
        {tab === 'overview' && (
          <div>
            <h3>Overview</h3>
            <p>{pkg.description}</p>
          </div>
        )}
         {tab === 'options' && (
          <div>
            <h3>Options</h3>
            <ul>
              {pkg.options.map(o => (
                <li key={o.id}>
                  <label>
                    <input type="checkbox" checked={selectedOptions.includes(o.id)} onChange={() => toggleOption(o.id)} />
                    {o.name} (+${o.price})
                  </label>
                </li>
              ))}
            </ul>
            <p>Selected: {selectedOptions.join(', ') || 'none'}</p>
            <button>Proceed to Book</button>
          </div>
        )}
        {tab === 'reviews' && (
          <div>
            <h3>Reviews</h3>
            {pkg.reviews.map(r => (
              <div key={r.id} className="review">
                <strong>{r.author}</strong> — {Array(r.rating).fill('★').join('')}
                <p>{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PackageTabs;