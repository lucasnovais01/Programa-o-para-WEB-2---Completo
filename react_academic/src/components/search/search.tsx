import type { ChangeEvent } from "react";
import './search.css';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  setRecordPerPage: number;
  handleRecordsPerPageChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}


const SearchBar = ({
  searchTerm,
  setSearchTerm,
  setRecordPerPage,
  handleRecordsPerPageChange,
}: SearchBarProps) => {
  return (
    <><div className="records">
      <div className="input-search">
        <label className="app-label">Pesquisa:</label>
        <input
          type="text"
          placeholder="buscar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="select-page"></div>
    </div>
    
    <div className="select-page">
        <label htmlFor="recordsPerPage" className="app-label">
          Registros por página
        </label>

        <select 
          id="recordsPerPage"
          value={setRecordPerPage}
          onChange={handleRecordsPerPageChange}        
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div></>
  );
};