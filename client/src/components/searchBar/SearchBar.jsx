import './SearchBar.css';

export default function SearchBar({searchValue, handleOnSearch}) {
    return (<div className='searchBarContainer'>
        <input
            type='text'
            value={searchValue}
            onChange={handleOnSearch}
            placeholder='Град...'
            className='searchInput'
        />
        <span className='searchIcon'>🔍</span>
    </div>);
};