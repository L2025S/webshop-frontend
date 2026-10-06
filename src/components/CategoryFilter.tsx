import type { ChangeEvent } from "react";
import type { Category } from "../types/Category";

type CategoryFilterProps = {
    categories: Category[];
    selectedCategoryId: number | null; // null means "All categories"
    onChange: (categoryId: number | null) =>void;
};

export default function CategoryFilter({
    categories,
    selectedCategoryId,
    onChange,   
} : CategoryFilterProps) {
        

    function handleChange(event: ChangeEvent<HTMLSelectElement>){

        const value = event.target.value;

        // An empty value is the "All categories" option, which means no filter
        onChange(value === ""? null : Number(value));

    }

    return (
        <div className="category-filter">
            <label htmlFor="category-filter" className="category-filter__label">
                Category
            </label>
            <select 
            id="category-filter"
            className="category-filter__select"
            value={selectedCategoryId === null ? "": String(selectedCategoryId)}
            onChange={handleChange}
            >
                <option value="">All categories</option>
                {categories.map((category) =>(
                    <option key={category.id} value = {category.id}>
                        {category.name}
                    </option>
                ))}

            </select>

        </div>
    )


}