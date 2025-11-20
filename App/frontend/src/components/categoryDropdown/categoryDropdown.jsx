import Select from 'react-select';

const CategoryDropdown = ({
  category_object,
  placeholder_text,
  handleOptionSelect,
  index
}) => {

    // Asegurarse de que category_object exista y tenga contenido
    if (!category_object || !category_object.content) {
        return null;
    }
    return (
        <Select
        options={category_object.content.map(item => ({
            value: item,
            label: item
        }))}
        placeholder={placeholder_text}
        menuPlacement="auto"
        menuMaxHeight={100}
        onChange={(selected) => handleOptionSelect(selected, index)}
        />
    );
};

export default CategoryDropdown; 