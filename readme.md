This package is not directly working as a complete module, you can directly ref the exported component. 

Sample JSON form config for user sign in
```
export const accUser_signIn_form: Array<iFormControlConfig> = [
    {
        name: te_account.account,
        title: "Account",
        placeHolder: "Account or Email",
        placeHolderOnly: true,
        type: eFormControlType.text,
        varAttr: {
            required: true,
            minLength: 4,
            maxLength: 20,
        },
        varCust: [
            {
                validateFn: (value) => {
                    return value && (/^[a-zA-Z0-9]+$/.test(value) || regex.email.test(value));
                },
                message: () => "Not valid account or email",
            },
        ],
    },
    {
        name: te_account.password,
        title: "Password",
        placeHolder: "Password",
        placeHolderOnly: true,
        type: eFormControlType.text,
        typeSub: eFormControlTypeSub.password,
        varAttr: {
            required: true,
            minLength: 6,
            maxLength: 20,
        },
        varCust: [
            {
                validateFn: (value) => {
                    return value && /^[a-zA-Z0-9-_]+$/.test(value)
                },
                message: () => "Only letter, number, - and _",
            },
        ],
    },
]
```


Sample JSON form config for signup

```
export const accUser_signUp_form: Array<iFormControlConfig> = [
    {
        name: te_account.account,
        title: "Account",
        placeHolder: "Account",
        placeHolderOnly: true,
        type: eFormControlType.text,
        varAttr: {
            required: true,
            minLength: 4,
            maxLength: 20,
        },
        varCust: [
            {
                validateFn: (value) => {
                    return value && /^[a-zA-Z0-9]+$/.test(value)
                },
                message: () => "Only letter and number",
            },
        ],
    },
    {
        name: te_account.password,
        title: "Password",
        placeHolder: "Password",
        placeHolderOnly: true,
        type: eFormControlType.text,
        typeSub: eFormControlTypeSub.password,
        varAttr: {
            required: true,
            minLength: 6,
            maxLength: 20,
        },
        varCust: [
            {
                validateFn: (value) => {
                    return value && /^[a-zA-Z0-9-_]+$/.test(value)
                },
                message: () => "Only letter, number, - and _",
            },
        ],
    },
    {
        name: te_account.password + "Confirm",
        title: "Password Confirm",
        placeHolder: "Password Confirm",
        placeHolderOnly: true,
        type: eFormControlType.text,
        typeSub: eFormControlTypeSub.password,
        varAttr: {
            required: true,
        },
        varCust: [
            {
                validateFn: (value, formData?) => {
                    if (!value) {
                        return true;
                    }
                    try {
                        let passwordOriginValue;
                        if (formData) {
                            passwordOriginValue = formData[te_account.password];
                        } else {
                            const password = document.querySelector(`input[name=${te_account.password}]`) as HTMLInputElement;
                            passwordOriginValue = password.value;
                        }

                        if (passwordOriginValue !== value) {
                            return false
                        }
                    } catch (e) {
                        return false
                    }

                    return true
                },
                message: () => "passwords do not match",
            },
        ],
    },
    {
        name: te_account.name,
        title: "Nick Name",
        placeHolder: "Nick Name",
        placeHolderOnly: true,
        type: eFormControlType.text,
        varAttr: {
            required: true,
        },
        varCust: [
            {
                validateFn: (value) => {
                    return value && /^[a-zA-Z0-9-_]+$/.test(value)
                },
                message: () => "Only letter, number, - and _",
            },
        ],
    },
    {
        name: te_account.ageYear,
        title: "Age",
        placeHolder: "Age",
        placeHolderOnly: true,
        type: eFormControlType.text,
        typeSub: eFormControlTypeSub.number,
        varAttr: {
            required: true,
            min: 12,
            max:130,
        },
    },
    {
        name: te_account.email,
        title: "Email",
        placeHolder: "Email - used for finding password",
        placeHolderOnly: true,
        type: eFormControlType.text,
        typeSub: eFormControlTypeSub.email,
        varAttr: {
            maxLength: 50,
        },
        varCust: [
            {
                validateFn: (value) => {
                    return value && regex.email.test(value)
                },
                message: () => "Invalid email format",
            },
        ],
    },
];
```