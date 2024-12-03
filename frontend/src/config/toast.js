export const registrationSuccess = {
  text: "Registration successful",
  duration: 3000,
  gravity: "bottom", // `top` or `bottom`
  position: "right", // `left`, `center` or `right`
  stopOnFocus: false, // Prevents dismissing of toast on hover
  style: {
    background: "linear-gradient(to right, #7dd975, #49a078)",
  }
}

export const registrationError = {
  text: "Registration error",
  duration: 3000,
  gravity: "bottom", // `top` or `bottom`
  position: "right", // `left`, `center` or `right`
  stopOnFocus: false, // Prevents dismissing of toast on hover
  style: {
    background: "linear-gradient(to right, #c44127, #c78a7d)",
  }
}

export const formCreationSuccess = {
  text: "Form created",
  duration: 3000,
  gravity: "bottom", // `top` or `bottom`
  position: "right", // `left`, `center` or `right`
  stopOnFocus: false, // Prevents dismissing of toast on hover
  style: {
    background: "linear-gradient(to right, #7dd975, #49a078)",
  }
}

export const formCreationError = {
  text: "Error on form creation",
  duration: 3000,
  gravity: "bottom", // `top` or `bottom`
  position: "right", // `left`, `center` or `right`
  stopOnFocus: false, // Prevents dismissing of toast on hover
  style: {
    background: "linear-gradient(to right, #c44127, #c78a7d)",
  }
}

export const listFetchError = {
  text: "Couldn't fetch the list",
  duration: 3000,
  gravity: "bottom", // `top` or `bottom`
  position: "right", // `left`, `center` or `right`
  stopOnFocus: false, // Prevents dismissing of toast on hover
  style: {
    background: "linear-gradient(to right, #c44127, #c78a7d)",
  }
}
export default { registrationSuccess, registrationError, formCreationSuccess, formCreationError, listFetchError };
