import Select from 'react-select';
import { useState, useEffect } from 'react';
import { getCategoryByName } from '../../api/CategoryApi';

const CategoryDropdown = ({
  categoryName,
  placeholder_text,
  handleOptionSelect,
  category_object
}) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // el category name se carga desde el backend cuando se pasa como prop
    useEffect(() => {
        // Si tenemos category_object local, usarlo directamente (es más rápido y actualizado)
        if (category_object && category_object.content) {
            const opts = category_object.content.map(item => ({
                value: item,
                label: item
            }));
            setOptions(opts);
            setError(null);
            setLoading(false);
        } else if (categoryName) {
            // Si no tenemos el objeto local, buscar en el backend
            setLoading(true);
            getCategoryByName(categoryName)
                .then(category => {
                    const opts = category.content.map(item => ({
                        value: item,
                        label: item
                    }));
                    setOptions(opts);
                    setError(null);
                })
                .catch(err => {
                    console.error(err);
                    setError(err.message);
                    setOptions([]);
                })
                .finally(() => setLoading(false));
        }
    }, [categoryName, category_object]);

    // Asegurarse de que hay opciones o esté cargando
    if (error) {
        return <div style={{ color: 'red' }}>Error: {error}</div>;
    }

    if (loading) {
        return <div>Cargando opciones...</div>;
    }

    if (options.length === 0) {
        return null;
    }

    return (
        <Select
        options={options}
        placeholder={placeholder_text}
        menuPlacement="auto"
        menuMaxHeight={100}
        onChange={(selected) => handleOptionSelect(selected)}
        />
    );
};

export default CategoryDropdown;