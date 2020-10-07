import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";
import PasswordMask from 'react-password-mask';

export default function Form() {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        password: "", 
        terms: false
    });


const [serverError, setServerError] = useState("");

const [buttonIsDisabled, setButtonIsDisabled] = useState(true);

const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    terms: ""
});

const [post, setPost] = useState([]);

const validateChange = (e) => {
    yup
        .reach(formSchema, e.target.name)
        .validate(
        e.target.type === "checkbox" ? e.target.checked : e.target.value
        )
        .then((valid) => {

        setErrors({ ...errors, [e.target.name]: "" });
        })
        .catch((err) => {
        console.log("err", err);
        setErrors({ ...errors, [e.target.name]: err.errors[0] });
        });
};

const formSubmit = (e) => {
    e.preventDefault();

    axios
        .post("https://reqres.in/api/users", formState)
        .then ((resp) => {
            setPost(resp.data);
            setServerError(null);
            setFormState({
                name: "",
                email: "",
                password: "",
                terms: false
            });
        })
        .catch((err) => {
            setServerError("Uh oh! Something broke... don't worry. I'll fix it.");
        });
};

const inputChange =(e) => {
    e.persist();

    const newFormState = {
        ...formState,
        [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value
    };

    validateChange(e);
    setFormState(newFormState);
};

const formSchema = yup.object().shape({
    name:yup.string().required("I need your name please."),
    email: yup.string().email(),
    password: yup.string().required("Please enter a valid secret code."),
    terms: yup.boolean().oneOf([true])
});

useEffect(() => {
formSchema.isValid(formState).then((valid) => {
    console.log ("Is it Valid?", valid);
    setButtonIsDisabled(!valid);
});
}, [formState]);

console.log("formState", formState);
    return (
        <form onSubmit={formSubmit}>
            {serverError && <p className="error">{serverError}</p>}

        <label htmlFor="name">
            Name
            <input
            id="name"
            type="text"
            name="name"
            value={formState.name}
            onChange={inputChange}
        />
        {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null}
    </label>
    <label htmlFor="email">
        Email
        <input
            id="email"
            type="text"
            name="email"
            value={formState.email}
            onChange={inputChange}
        />
        {errors.email.length > 0 ? (
            <p className="error">{errors.email}</p>
        ) : null}
    </label>
    <label htmlFor="password">
        Password
        <PasswordMask
        id="password"
        name="password"
        value={formState.password}
        onChange={inputChange}
        // useVendorStyles={false}
/>
        {/* <input
            id="password"
            type="password"
            name="password"
            value={formState.password}
            onChange={inputChange}
        /> */}
        {errors.password.length > 0 ? (
            <p className="error">{errors.password}</p>
        ) : null}
    </label>
        <label htmlFor="terms" className="terms">
        <input
            type="checkbox"
            id="terms"
            name="terms"
            checked={formState.terms}
            onChange={inputChange}
        />
        Terms & Conditions
        {errors.terms.length > 0 ? (
            <p className="error">{errors.terms}</p>
            ) : null}
        </label>
        <button type="submit" disabled={buttonIsDisabled}>
        Submit
        </button>
        <pre>{JSON.stringify(post, null, 2)}</pre>
    </form>
        );
    }