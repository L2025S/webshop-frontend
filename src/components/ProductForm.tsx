


// Every filed is kept as a string while the ROLE_ADMIN put in the values..

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { Product } from "../types/Product";
import type { ProductRequest } from "../types/ProductRequest";
import { fetchAllCategories } from "../services/categoryService";
import type { Category } from "../types/Category";
import { ApiError } from "../errors/ApiError";
import { createProduct } from "../services/productService";

//----------------------------------------------------------------------------------------------------
// Types 
// ---------------------------------------------------------------------------------------------------



// Numbers are only converted when the firm is submitted
type FormValues = {
    name: string;
    imageUrl: string;
    price:string;
    description: string;
    stock: string;
    categoryId: string;
};

type FieldName = keyof FormValues;
type FormErrors = Partial <Record<FieldName, string>>;
// FieldName is another type you defined elsewhere. It is probably a union of string literals like "name" |"email" |"price"
// Record<FieldName, string> builds an object type where every key in FieldName must exist and each value is a string. 
// Partial<...> makes every property optional. So the result is an object that may contain an error message for some fields, for all of them , or for none.
// type FormErros = ... jsut give that comebined type a readable name

type ProductFormProps = {
    onProductCreated: ( createdProduct: Product) => void;
};


// ----------------------------------------------------------------------------------------------------
// Constants ( same limits as ProductRequestDTO in the backend)
// -----------------------------------------------------------------------------------------------------

const NAME_MAX_LENGTH = 400;
const DESCRIPTION_MAX_LENGTH = 1_000; 
const MIN_PRICE = 0.01;
const MAX_JAVA_INT = 2147483647; // stock is an int in the backend.


const FIELD_ORDER: FieldName[] = [
    "name",
    "imageUrl",
    "price",
    "description",
    "stock",
    "categoryId",
];

const EMPTY_FORM_VALUES: FormValues = {
    name: "",
    imageUrl:"",
    price: "",
    description: "",
    stock: "0",
    categoryId:"",

};


// ------------------------------------------------------------------------------------------------------
// Helper functions 
// -------------------------------------------------------------------------------------------------------

// Accepts both "12.5" & "12,5" because Swedish users often type a comma. 
function parsePrice(priceText: string): number {
    return Number(priceText.trim().replace(",", "."));
}

function isValidImageUrl(imageUrlText: string): boolean {
    try {
        const parsedUrl = new URL ( imageUrlText);
        return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";

    } catch {
        return false;
    }
}


// Runs the same rules as the backend so most mistakes are caught before sending. 
function validateForm ( formValues: FormValues): FormErrors {
        const errors: FormErrors = {};

        const trimmedName = formValues.name.trim();
        if(trimmedName === "") {
            errors.name = "Name is required.";

        } else if ( trimmedName.length > NAME_MAX_LENGTH){
            errors.name = `Product name can be at most ${NAME_MAX_LENGTH} characters.`;
        }

        const trimmedImageUrl = formValues.imageUrl.trim();
        if ( trimmedImageUrl !== "" && !isValidImageUrl(trimmedImageUrl)) {
            errors.imageUrl = " Enter a full URL that starts with http:// or https://.";
        }

        const trimmedPrice = formValues.price.trim();
        if ( trimmedPrice === "") {
            errors.price = "Price is required.";
        } else {
            const priceNumber = parsePrice(trimmedPrice);
            if (!Number.isFinite(priceNumber)) {
                errors.price = "Price must be a number.";
            } else if ( priceNumber < MIN_PRICE) {
                errors.price = `Price must be at leaset ${MIN_PRICE}.`;
            }
        }


        if ( formValues.description.trim().length > DESCRIPTION_MAX_LENGTH) {
            errors.description = `Description can have a maximum of ${DESCRIPTION_MAX_LENGTH} characters.`;
        }

        const trimmedStock = formValues.stock.trim();
        if (!/^\d+$/.test(trimmedStock)) {
            errors.stock = "Stock must be a whole number of 0 or more.";
        } else if (Number (trimmedStock) > MAX_JAVA_INT) {
            errors.stock ="Stock is too large.";
        }

        return errors;
}


// Converts the string values into the JSON body the backend expects. 
function buildProductRequest(formValues: FormValues): ProductRequest {

    const trimmedImageUrl = formValues.imageUrl.trim();

    return {
        name: formValues.name.trim(),
        imageUrl: trimmedImageUrl === "" ? null : trimmedImageUrl,
        price: parsePrice(formValues.price),
        // we send "" instead of null on purpose: Productpage calls. 
        description: formValues.description.trim(),
        stock: Number ( formValues.stock.trim()),
        categoryId: formValues.categoryId === "" ? null: Number (formValues.categoryId),
    };
}


// ---------------------------------------------------------------------------------------------------------------------
// Component 
// ---------------------------------------------------------------------------------------------------------------------


export default function ProductForm ({
    onProductCreated,
}: ProductFormProps) {
    // useId gives unique ids so each <label< is linked to its input. 
    const formId = useId();

    const [formValues, setFormValues] = useState<FormValues>(EMPTY_FORM_VALUES);
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesError, setCategoriesError] = useState<string |null>(null);


    // Keeps a reference to every input so we can focus the first invalid one. 
    const fieldRefs = useRef<Record<FieldName, HTMLElement | null>> ({
        name: null, 
        imageUrl: null,
        price: null,
        description: null,
        stock: null,
        categoryId: null,
    });


    // Load the categories for the dropdown once, when the form first appears. 
    useEffect(()=> {
        async function loadCategories () {
            try {
                const loadedCategories = await fetchAllCategories();
                setCategories (loadedCategories);

            } catch (error) {
                console.error("Could not load categories:", error);
                setCategoriesError(
                    "Could not load categories. You can still create a product without a category.",
                );

            }
        }

        loadCategories();

    }, []);



    // Updates one field and clears that field's error whil teh admin is fixing it 
    function updateField(fieldName: FieldName, newValue: string) {
        setFormValues((currentValues) =>({
            ...currentValues,
            [fieldName]: newValue
        }));

        setFieldErrors((currentErrors) =>({
            ...currentErrors,
            [fieldName]: undefined,
        }));

        setSuccessMessage(null);
    }

    async function handleSubmit ( event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setServerError(null);
        setSuccessMessage(null);

        const validationErrors = validateForm(formValues);
        const firstInvalidField = FIELD_ORDER.find(
            (fieldName) => validationErrors[fieldName],
        );


        if (firstInvalidField) {
            setFieldErrors (validationErrors);
            fieldRefs.current[firstInvalidField]?.focus();
            return;
        }

        setIsSubmitting(true); 

        try {

            const createdProduct= await createProduct(buildProductRequest(formValues));

            onProductCreated(createdProduct);
            setFormValues(EMPTY_FORM_VALUES);
            setFieldErrors({});
            setSuccessMessage(`Product "${createdProduct.name}" was created.`);
        } catch (error) {
            if ( error instanceof ApiError) {
                setServerError(error.message);
            } else {
                setServerError ("An unexpected error occurred. Please try again later.");
            }

        } finally {
                setIsSubmitting(false);
        }
    }

    return (
        <form className="admin-form" onSubmit={handleSubmit} noValidate>
            <h2 className="admin-form__title">Add new product</h2>

            {serverError && (
                <p className="admin-form__message admin-form__message--error" role="alert">
                    {serverError}
                </p>
            )}

            {successMessage &&(
                <p className="admin-form__message admin-form__message--success" role="status">
                    {successMessage}
                </p>
            )}


            {/* Name */}
            <div className="admin-form__field">
                <label htmlFor={`${formId}-name`}>Name *</label>
                <input 
                id={`${formId}-name`}
                type="text" 
                value={formValues.name}
                onChange={(event) => updateField("name", event.target.value)}
                ref={(element) => {
                    fieldRefs.current.name = element;
                }}
                aria-invalid={fieldErrors.name ? true: undefined}
                aria-describedby = {fieldErrors.name ? `${formId}-name-error` : undefined}
                />

                {fieldErrors.name && (
                    <p 
                    id={`${formId}-name-error`}
                    className="admin-form__error"
                    >
                        {fieldErrors.name}
                    </p>
                )}
            </div>


            {/* Image URL */}
            <div className="admin-form__field">
                <label htmlFor={`${formId}-imageUrl`}>Image URL</label>
                <input 
                id={`${formId}-imageUrl`}
                type="text"
                placeholder="https://example.com/image.png" 
                value={formValues.imageUrl}
                onChange={(event) => updateField("imageUrl", event.target.value)}
                ref={(element) => {
                    fieldRefs.current.imageUrl = element;
                }}
                aria-invalid={fieldErrors.imageUrl ? true : undefined}
                aria-describedby={fieldErrors.imageUrl ? `${formId}-imageUrl-error` : undefined}
                />

                {fieldErrors.imageUrl && (
                    <p id={`${formId}-imageUrl-error`} className="admin-form__error">
                        {fieldErrors.imageUrl}
                    </p>
                )}
            </div>


            {/*  Price and stock share one row on wide screens */}
            <div className="admin-form__row">
                <div className="admin-form__field">
                    <label htmlFor={`${formId}-price`}>Price (SEK) *</label>
                    <input
                    id={`{formId}-price`}
                     type="text" 
                     inputMode="decimal"
                     placeholder="99.90"
                     value={formValues.price}
                     onChange={(event) => updateField("price", event.target.value)}
                     ref={(element) => {
                        fieldRefs.current.price = element;
                     }}
                    aria-invalid={fieldErrors.price ? true : undefined}
                    aria-describedby = {fieldErrors.price? `${formId}-price-error` : undefined}
                    />
                    {fieldErrors.price && (
                        <p id={`${formId}-price-error`} className="admin-form__error">
                            {fieldErrors.price}
                        </p>
                    )}
                </div>
            </div>


            {/* Category  */}
            <div className="admin-form__field">
                <label htmlFor={`${formId}-categoryId`}>Category</label>
                <select 
                id={`${formId}-categoryId`}
                value={formValues.categoryId}
                onChange={(event) => updateField("categoryId", event.target.value)}
                ref={(element) => {
                    fieldRefs.current.categoryId = element;
                }}
                >
                    <option value="">No Category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={String(category.id)}>
                            {category.name}
                        </option>
                    ))}
                </select>
                {categoriesError && (
                    <p className="admin-form__hint">{categoriesError}</p>
                )}

            </div>



            {/* Description */}
            <div className="admin-form__field">
                <label htmlFor="">Description</label>
                <textarea 
                id={`${formId}-description`}
                rows={4}
                value={formValues.description}
                onChange={(event) => updateField("description", event.target.value)}
                ref={(element) => {
                    fieldRefs.current.description = element;
                }}
                aria-invalid={fieldErrors.description ? true: undefined}
                aria-describedby={
                    fieldErrors.description ? `${formId}-description-error` : undefined
                }
                />
                <p className="admin-form__hint">
                    {formValues.description.length} /{DESCRIPTION_MAX_LENGTH} characters
                </p>
                {fieldErrors.description && (
                    <p id={`${formId}-description-error`} className="admin-form__error">
                        {fieldErrors.description}
                    </p>
                )}
            </div>
            <button 
            type="submit"
            className="admin-form__submit"
            disabled={isSubmitting}
            >
                {isSubmitting ? "Creating..." : "Create product"}
            </button>
        </form>
    );
}
