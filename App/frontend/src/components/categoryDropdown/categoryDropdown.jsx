import Select from 'react-select';
import { useState, useEffect } from 'react';
import { getCategoryByTitle } from '../../api/CategoryApi';

const CategoryDropdown = ({
  categoryName,
  placeholder_text,
  handleOptionSelect
}) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Always fetch category by name from backend
    useEffect(() => {
        if (!categoryName) {
            setOptions([]);
            return;
        }

        setLoading(true);
        getCategoryByTitle(categoryName)
            .then(category => {
                const opts = (category.content || []).map(item => ({ value: item, label: item }));
                setOptions(opts);
                setError(null);
            })
            .catch(err => {
                console.error(err);
                setError(err.message || 'Error loading category');
                setOptions([]);
            })
            .finally(() => setLoading(false));
    }, [categoryName]);

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