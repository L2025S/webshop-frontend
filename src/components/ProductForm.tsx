


// Every filed is kept as a string while the ROLE_ADMIN put in the values..

import { useId, useState } from "react";
import type { Product } from "../types/Product";
import type { ProductRequest } from "../types/ProductRequest";

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

    const[formValues, setFormValues] = useState<FormValues>(EMPTY_FORM_VALUES);
    
}
