// src/components/CategoryMultiSelect.jsx
import Select from 'react-select';

export default function CategoryMultiSelect({ categorias, selectedCategories, setSelectedCategories }) {
  const options = categorias.map(cat => ({ value: cat.id, label: cat.nombre }));

  return (
    <div className="mb-4 w-full md:w-1/2">
      <Select
        isMulti
        options={options}
        value={options.filter(o => selectedCategories.includes(o.value))}
        onChange={(selected) => setSelectedCategories(selected.map(opt => opt.value))}
        placeholder="Filtrar por Categoría"
      />
    </div>
  );
}
