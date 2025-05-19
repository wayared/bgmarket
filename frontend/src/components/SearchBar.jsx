// src/components/SearchBar.jsx
export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Buscar producto..."
      className="border border-gray-300 rounded px-4 py-2 mb-4 w-full md:w-1/2"
    />
  );
}
