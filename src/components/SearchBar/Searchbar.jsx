import { useRef } from 'react';
import PropTypes from 'prop-types';
import './Searchbar.css';

export default function Searchbar({ onSubmit }) {
  const inputRef = useRef();

  const handleSubmit = evt => {
    const form = evt.currentTarget;
    evt.preventDefault();
    onSubmit(inputRef.current.value);
    form.reset();
  };

  return (
    <header className="searchbar">
      <form className="searchForm" onSubmit={handleSubmit}>
        <button type="submit" className="searchForm-button">
          <span className="button-label">Search</span>
        </button>
        <input
          className="searchForm-input"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          ref={inputRef}
        />
      </form>
    </header>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
