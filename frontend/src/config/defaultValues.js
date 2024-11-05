const pictureFolder = "src/assets/pictures/"

const attributeList = [
  {
    min: "-5",
    max: "5",
    defaultValue: "0",
    leftColor: "#a8dadc",
    leftLabel: "Boring",
    rightColor: "#e9c46a",
    rightLabel: "Amazing",
  },
  {
    min: "-5",
    max: "5",
    defaultValue: "0",
    leftColor: "#457b9d",
    leftLabel: "Hate",
    rightColor: "#e63946",
    rightLabel: "Love",
  },
  {
    min: "-5",
    max: "5",
    defaultValue: "0",
    leftColor: "#a8dadc",
    leftLabel: "Cute",
    rightColor: "#49a078",
    rightLabel: "Beautiful",
  },
  {
    min: "-5",
    max: "5",
    defaultValue: "0",
    leftColor: "#a98467",
    leftLabel: "Poor",
    rightColor: "#be95c4",
    rightLabel: "Rich",
  },
];

const inputQuestionList = [
  {
    type: "input",
    question: "Name",
  },
  {
    type: "input",
    question: "Surname",
  },
  {
    type: "input",
    question: "What's your dog's name?",
  },
];

const textareaQuestionList = [
  {
    type: "textarea",
    question: "Description",
  },
  {
    type: "textarea",
    question: "Comments",
  },
  {
    type: "textarea",
    question: "Grocery list",
  },
  {
    type: "textarea",
    question: "Traveling plan",
  },
];

const dateQuestionList = [
  {
    type: "date",
    question: "When were you born?",
    format: "date",
  },
  {
    type: "date",
    question: "When did you finish school?",
    format: "date",
  },
  {
    type: "date",
    question: "When was your last meal?",
    format: "datetime-local",
  },
];

const radioQuestionList = [
  {
    type: "radio",
    question: "What's your favorite movie genre?",
    options: [
      { text: "Action", actions: [] },
      { text: "Romance", actions: [] },
      { text: "Drama", actions: [] },
      { text: "Horror", actions: [] },
      { text: "None of the above", actions: [] },
    ],
  },
  {
    type: "radio",
    question: "How old are you?",
    options: [
      { text: "0 ~ 18 years old", actions: [] },
      { text: "19 ~ 34 years old", actions: [] },
      { text: "35 ~ 49 years old", actions: [] },
      { text: "50 ~ 69 years old", actions: [] },
      { text: "70 ~ 99 years old", actions: [] },
    ],
  },
  {
    type: "radio",
    question: "Gender",
    options: [
      { text: "Male", actions: [] },
      { text: "Female", actions: [] },
      { text: "Other", actions: [] },
    ],
  },
  {
    type: "radio",
    question: "Love is",
    options: [
      { text: "Everything", actions: [] },
      { text: "Very important", actions: [] },
      { text: "Something I'm looking for", actions: [] },
      { text: "Overrated", actions: [] },
      { text: "Unknown to me", actions: [] },
    ],
  },
];

const checkboxQuestionList = [
  {
    type: "checkbox",
    question: "What animals do you like? Select at least one option",
    options: [
      { text: "Dogs", actions: [] },
      { text: "Cats", actions: [] },
      { text: "Horses", actions: [] },
      { text: "Hamsters", actions: [] },
      { text: "Insects", actions: [] },
      { text: "Cows", actions: [] },
      { text: "Reptiles", actions: [] },
      { text: "Dolphins", actions: [] },
      { text: "I don't like animals", actions: [] },
    ],
  },
  {
    type: "checkbox",
    question: "Things I would do on a weekend",
    options: [
      { text: "Play sports", actions: [] },
      { text: "Play videogames", actions: [] },
      { text: "Read books", actions: [] },
      { text: "Hangout with friends", actions: [] },
    ],
  },
  {
    type: "checkbox",
    question: "I have seen",
    options: [
      { text: "Harry Potter", actions: [] },
      { text: "Pirates of the caribbean", actions: [] },
      { text: "Avatar", actions: [] },
      { text: "Frozen", actions: [] },
      { text: "Lord of the rings", actions: [] },
    ],
  },
];

const selectQuestionList = [
  {
    type: "select",
    question: "What country are you from?",
    options: [
      { text: "China", actions: [] },
      { text: "Korea", actions: [] },
      { text: "Germany", actions: [] },
      { text: "Japan", actions: [] },
      { text: "Spain", actions: [] },
      { text: "United States of America", actions: [] },
      { text: "United Kingdom", actions: [] },
      { text: "None of the above", actions: [] },
    ],
  },
  {
    type: "select",
    question: "I was born in",
    options: [
      { text: "70s", actions: [] },
      { text: "80s", actions: [] },
      { text: "90s", actions: [] },
      { text: "I don't want to answer", actions: [] },
    ],
  },
  {
    type: "select",
    question: "Main form of contact",
    options: [
      { text: "Phone call", actions: [] },
      { text: "Email", actions: [] },
      { text: "SMS", actions: [] },
      { text: "Postal service", actions: [] },
      { text: "Don't contact me", actions: [] },
    ],
  },
];

const resultList = [
  {
    name: "Cat",
    description: "When were you born?",
    picture: pictureFolder + "cat.jpg",
    attributeValues: {}
  },
  {
    name: "Dog",
    description: "When were you born?",
    picture: pictureFolder + "dog.jpg",
    attributeValues: {}
  },
  {
    name: "Doctor",
    description: "When were you born?",
    picture: pictureFolder + "doctor.jpg",
    attributeValues: {}
  },
  {
    name: "Tennis Player",
    description: "When were you born?",
    picture: pictureFolder + "tennisPlayer.jpg",
    attributeValues: {}
  },
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const defaultAttribute = function () {
  return {...attributeList[getRandomInt(attributeList.length)]};
};

const defaultInputQuestion = function () {
  return {...inputQuestionList[getRandomInt(inputQuestionList.length)]};
};

const defaultTextareaQuestion = function () {
  return {...textareaQuestionList[getRandomInt(textareaQuestionList.length)]};
};

const defaultDateQuestion = function () {
  return {...dateQuestionList[getRandomInt(dateQuestionList.length)]};
};

const defaultRadioQuestion = function () {
  return {...radioQuestionList[getRandomInt(radioQuestionList.length)]};
};

const defaultCheckboxQuestion = function () {
  return {...checkboxQuestionList[getRandomInt(checkboxQuestionList.length)]};
};

const defaultSelectQuestion = function () {
  return {...selectQuestionList[getRandomInt(selectQuestionList.length)]};
};

const defaultResult = function () {
  return {...resultList[getRandomInt(resultList.length)]};
};

export default {
  defaultAttribute,
  defaultResult,
  defaultInputQuestion,
  defaultTextareaQuestion,
  defaultDateQuestion,
  defaultRadioQuestion,
  defaultCheckboxQuestion,
  defaultSelectQuestion,
};
