const decisionTreeData = {
    "question": "Where is the affected area positioned?",
    "options": {
        "Head": {
            "question": "What is the size of the affected area?",
            "options": {
                "Single lesion": {
                    "question": "Duration of the lesion?",
                    "options": {
                        "Weeks to Months": {
                            "question": "Does the affected area itch?",
                            "options": {
                                "Yes": {
                                    "question": "Is there any associated fever?",
                                    "options": {
                                        "Yes": "Possible infection or inflammatory condition; consider antibiotics or anti-inflammatory treatment.",
                                        "No": "Benign keratosis; monitor and consult if changes occur."
                                    }
                                },
                                "No": {
                                    "question": "Is the lesion raised or flat?",
                                    "options": {
                                        "Raised": "Likely dermatofibroma; benign but consult dermatology if concerned.",
                                        "Flat": "Possible melanoma; urgent dermatology referral required."
                                    }
                                }
                            }
                        },
                        "Months to Years": "Suspect chronic condition; refer to dermatology for potential biopsy and further testing."
                    }
                },
                "Limited area": "Further analysis by dermatologist required; schedule an appointment.",
                "Widespread": {
                    "question": "Does the area show signs of scaling?",
                    "options": {
                        "Yes": "Potential psoriasis; dermatological assessment recommended.",
                        "No": "Observe and if symptoms persist, consult a specialist."
                    }
                }
            }
        },
        "Chest": {
            "question": "Is the affected area painful?",
            "options": {
                "Yes": "Potential cardiac issue if pain is sharp and persistent; seek immediate medical attention.",
                "No": "Likely non-critical; monitor and consult if condition worsens."
            }
        },
        "Upper Limb": {
            "question": "Is there any numbness?",
            "options": {
                "Yes": "Potential nerve damage or circulatory issue; neurological or cardiovascular assessment advised.",
                "No": "If pain or discomfort is present, consider physical therapy or orthopedic consultation."
            }
        },
        "Abdominal area": {
            "question": "Is the pain constant or intermittent?",
            "options": {
                "Constant": "Possible serious conditions like appendicitis or intestinal blockage; urgent medical evaluation needed.",
                "Intermittent": {
                    "question": "Does eating alleviate or worsen the pain?",
                    "options": {
                        "Alleviate": "Potential gastric issues such as ulcers; gastroenterology consultation recommended.",
                        "Worsen": "Could be gallbladder or pancreas related; seek gastroenterological advice."
                    }
                }
            }
        },
        "Lower Limb": {
            "question": "Is there swelling?",
            "options": {
                "Yes": {
                    "question": "Is the swelling localized to one area or throughout the limb?",
                    "options": {
                        "Localized": "Possible injury or infection; clinical examination required.",
                        "Throughout": "Potential lymphatic or circulatory issue; medical testing needed."
                    }
                },
                "No": "If pain is present, consider potential strain or sprain; if severe, medical evaluation advised."
            }
        }
    }
};

function displayResults(result) {
    console.log("Displaying results:", result);
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `<p>Most likely diagnosis: ${result}</p>`;
}

function displayQuestion(node) {
    console.log("Displaying question:", node.question);
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');

    questionElement.innerHTML = node.question;
    optionsElement.innerHTML = '';

    Object.keys(node.options).forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => handleOptionClick(node.options[option]);
        optionsElement.appendChild(button);
    });
}

function handleOptionClick(option) {
    if (typeof option === 'string') {
        displayResults(option);
    } else {
        displayQuestion(option);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing the quiz.");
    displayQuestion(decisionTreeData);
});
