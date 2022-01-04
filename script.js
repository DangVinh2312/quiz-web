// TODO(you): Write the JavaScript necessary to complete the assignment.
let idTest;
const answersBox = {};
answersBox.answers = {};
const questionsAPI = "https://wpr-quiz-api.herokuapp.com/attempts"

function getDataQuestions(callback) {
    fetch(questionsAPI, { method: "POST" })
        .then(response => {
            return response.json();
        }).then(data => {
            idTest = data._id;
            return data
        })
        .then(callback); 
}

function getCorrectAnswers(callback, data) {
    const answersAPI = questionsAPI + '/' + idTest + '/submit';
    fetch(answersAPI, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(responseSubmit => {
            return responseSubmit.json();
        }).then(response => {
            score = response.score;
            cmtLine = response.scoreText;
            return response;
        })
        .then(callback);
}

function start() {
    getDataQuestions(renderQuestions);
    handleSubmit();
    handleRenewExam();
}

start();

function renderQuestions(questionsData) {
    const questions = questionsData.questions;
    const startQuizBtn = document.querySelector('#start-button');
    startQuizBtn.addEventListener("click", handleToggleQuesBox);
    showQuestions(questions);
}

function showQuestions(questions) {
    let i = 0;
    const boxQuess = document.querySelectorAll('.quiz-box');
    boxQuess.forEach(boxQues => {
        const textQues = boxQues.querySelector('p');
        textQues.innerHTML = questions[i].text;
        const boxAnswer = boxQues.querySelector('.questions');
        questions[i].answers.forEach((answer, index) => {
            const boxChoice = document.createElement('div');
            boxChoice.className = 'ques-choice';
            const input = document.createElement('input')
            input.setAttribute("type", 'radio');
            input.setAttribute('name', questions[i]._id);
            input.setAttribute("id", (i + 1) + 'opt' + (index + 1))
            const label = document.createElement('label');
            label.setAttribute('for', (i + 1) + 'opt' + (index + 1));
            label.textContent = answer;
            boxChoice.appendChild(input);
            boxChoice.appendChild(label);
            boxAnswer.appendChild(boxChoice);
        })
        i++;
    })
}

function handleToggleQuesBox() {
    toggleAuthor();
    toggleIntroBox();
    toggleQuestions();
}

function toggleAuthor() {
    const authorName = document.querySelector('.author-name');
    authorName.classList.toggle("hidden");
}

function toggleIntroBox() {
    const examIntroduction = document.querySelector('.introduction-box')
    examIntroduction.classList.toggle('hidden');
}

function toggleQuestions() {
    const quizQuestions = document.querySelector('.ques-list');
    quizQuestions.classList.toggle("hidden");
}


function handleSubmit() {
    const submitQuiz = document.querySelector('#submit-button')
    submitQuiz.addEventListener('click', handleReviewBox)
}

function handleReviewBox() {
    toogleReviewBox();
    toogleSubmitBox();
    const quizQuestions = document.querySelectorAll('input[type ="radio"]');
    quizQuestions.forEach(quizQuestion => {
        quizQuestion.disabled = true;
    });
    checkAnswers();
}

function checkAnswers() {
    const quesBoxes = document.querySelectorAll('.questions');
    quesBoxes.forEach((quesBox) => {
        const quesChoices = quesBox.querySelectorAll('.ques-choice');
        quesChoices.forEach((quesChoice, index) => {
            const choice = quesChoice.querySelector('input');
            if (choice.checked === true) {
                answersBox.answers[choice.name] = index;
            }
        })
    })
    checkCorrectAnswers();
}

function checkCorrectAnswers() {
    getCorrectAnswers((answerData) => {
        const quesBoxes = document.querySelectorAll('.questions');
        quesBoxes.forEach((quesBox) => {
            const quesChoices = quesBox.querySelectorAll('.ques-choice');
            quesChoices.forEach((quesChoice, index) => {
                const choice = quesChoice.querySelector('input');
                const label = quesChoice.querySelector('label');
                const cmtBox = document.createElement('p');
                quesChoice.appendChild(cmtBox);
                const correctChoice = answerData.correctAnswers[choice.name];
                if (choice.checked === false && index === correctChoice) {
                    label.setAttribute('class', 'correct');
                    cmtBox.setAttribute('class', 'cmt-box');
                    cmtBox.textContent = 'Correct Answer';
                }
                if (choice.checked === true && index === correctChoice) {
                    score++;
                    label.setAttribute('class', 'marked-answer');
                    cmtBox.setAttribute('class', 'cmt-box');
                    cmtBox.textContent = 'Correct Answer';
                }
                if (choice.checked === true && index !== correctChoice) {
                    label.setAttribute('class', 'wrong');
                    cmtBox.setAttribute('class', 'cmt-box');
                    cmtBox.textContent = 'Wrong Answer';
                }
            })
        });

        document.querySelector('#answer-result > span').textContent = `${answerData.score}`;
        document.querySelector('#scores').textContent = `${answerData.score * 10}%`;
        document.querySelector('#comment-line').textContent = `${answerData.scoreText}`;
    }, answersBox);
}

function toogleReviewBox() {
    const reviewBox = document.querySelector('.review-box-btn');
    reviewBox.classList.toggle('hidden');
}

function toogleSubmitBox() {
    const submitBtn = document.querySelector('.submit-box-btn');
    submitBtn.classList.toggle('hidden');
}

const clickedAnswers = document.querySelectorAll('input[type="radio"]');
clickedAnswers.forEach(clickedAnswer => {
    clickedAnswer.onclick = (e) => {
        const target = e.currentTarget;
        const parentTarget = target.parentElement;
        const ancestorTarget = parentTarget.parentElement;
        const selectedAnswer = ancestorTarget.querySelector(".answer-selected");
        const checkedInput = ancestorTarget.querySelector(".answer-selected input");

        if (target.checked) {
            parentTarget.classList.add("answer-selected");
            target.classList.add("checked")
        }

        if (checkedInput && checkedInput.classList.contains("checked")) {
            checkedInput.checked = false;
            selectedAnswer.classList.remove('answer-selected');
        }
    }
})

function checkedAnswers() {
    const target = e.currentTarget;
    const parentTarget = target.parentElement;
    const ancestorTarget = parentTarget.parentElement;
    const selectedAnswer = ancestorTarget.querySelector(".answer-selected");
    const checkedInput = ancestorTarget.querySelector(".answer-selected input");

    if (target.checked) {
        parentTarget.classList.add("answer-selected");
        target.classList.add("checked")
    }

    if (checkedInput && checkedInput.classList.contains("checked")) {
        checkedInput.checked = false;
        selectedAnswer.classList.remove('answer-selected');
    }
}

function handleRenewExam() {
    const retryTest = document.querySelector('#retry-button');
    retryTest.addEventListener('click', renewExam);
}

function renewExam() {
    toggleAuthor();
    toggleIntroBox();
    toggleQuestions();
    toogleReviewBox();
    toogleSubmitBox();

    const questions = document.querySelectorAll('.questions');
    questions.forEach(question => {
        question.disabled = false;
        const quesBoxes = question.querySelectorAll('.ques-choice');
        quesBoxes.forEach(quesBox => {
            quesBox.remove();
        })
    });
    start();
    answersBox.answers = {};
}


