import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth.js";

export class CheckResult {
  // userInfo = null;
  userInfo = '';

  constructor() {
    this.answers = [];
    this.test = [];
    this.questions = [];
    this.backToResults = null;

    const that = this;
    this.routeParams = UrlManager.getQueryParams();
    console.log(this.routeParams)

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://testologia.site/get-quiz-right?id=' + this.routeParams.id, true);
    // console.log(xhr)
    xhr.onload = () => {
      if (xhr.status === 200 && xhr.responseText) {
        try {
          this.answers = JSON.parse(xhr.responseText);
        } catch (e) {
          location.href = '#/';
        }
      } else {
        location.href = '#/';
      }
      this.getHtmlItems();
    }
    xhr.send();
  }



  getHtmlItems() {
    const that = this;

    this.routeParams = UrlManager.getQueryParams();
    const xhr = new XMLHttpRequest();

    xhr.open('GET', 'https://testologia.site/get-quiz?id=' + this.routeParams.id, true);
    // console.log(xhr)
    xhr.onload = () => {
      this.test = JSON.parse(xhr.responseText);
      document.getElementById('pre-title').innerText = this.test.name;
      this.test.questions.forEach((item, index) => {
        const checkResultQuestions = document.getElementById('check-result-questions');
        const checkResultQuestion = document.createElement('div');

        checkResultQuestion.className = ('check-result-question');
        checkResultQuestion.setAttribute('id', item.id);


        const checkResultQuestionTitleSpan = document.createElement('span');
        const checkResultQuestionTitle = document.createElement('div');
        checkResultQuestionTitle.innerText = "Вопрос " + Number(index + 1) + ': ';
        checkResultQuestionTitle.className = ('check-result-question-title');
        checkResultQuestionTitleSpan.innerText = item.question;
        checkResultQuestionTitle.appendChild(checkResultQuestionTitleSpan)
        checkResultQuestion.appendChild(checkResultQuestionTitle);
        checkResultQuestions.appendChild(checkResultQuestion);


        item.answers.find(answer => {
          const checkResultOption = document.createElement('div');
          checkResultOption.className = ('check-result-question-option');
          checkResultOption.setAttribute('id', answer.id);


          const inputId = 'answer-' + answer.id;

          const checkResultOptionAnswerLabel = document.createElement('label');
          checkResultOptionAnswerLabel.setAttribute('for', inputId);
          checkResultOptionAnswerLabel.innerText = answer.answer;

          const checkResultOptionAnswerInput = document.createElement('input');
          checkResultOptionAnswerInput.setAttribute('type', 'radio');
          checkResultOptionAnswerInput.setAttribute('name', 'answer');
          checkResultOptionAnswerInput.setAttribute('value', answer.id);
          checkResultOptionAnswerInput.setAttribute('disabled', 'disabled');

          checkResultOptionAnswerLabel.innerText = answer.answer;
          checkResultOption.appendChild(checkResultOptionAnswerInput);
          checkResultOption.appendChild(checkResultOptionAnswerLabel);
          checkResultQuestion.appendChild(checkResultOption);
        })
      })
      this.performer();
      this.isError();
      this.backToResults = document.getElementById('result');
      this.backToResults.onclick = function () {
        that.goToResults();
      }
    }
    xhr.send();

  }

  isError() {
    const questionResults = JSON.parse(localStorage.getItem('idArr'));

    const questionId = questionResults.map(item => {
      return item.questionId;
    })
    const chosenAnswer = questionResults.map(item => {
      return item.chosenAnswerId;
    })

    for (let i = 0; i < questionId.length; i++) {
      const checkResultOption = document.getElementById(chosenAnswer[i]);
      if (this.answers[i] === chosenAnswer[i]) {
        let child = checkResultOption.firstChild;
        child.classList.add('right');
        checkResultOption.classList.add('right-answer');

      } else {
        let child = checkResultOption.firstChild;
        child.classList.add('wrong');
        checkResultOption.classList.add('wrong-answer');
      }
    }
  }

  performer() {
    const userInfo = Auth.getUserInfo();
    const name = userInfo.fullName;
    const email = userInfo.email;

    console.log(name)

    const checkResultName = document.getElementById('check-result-name');

    checkResultName.innerText = ' ' + name + ', ' + email;

  }

  goToResults() {
    const id = this.routeParams.id;
    if ( id) {
      location.href = '#/result?score=' + '&id=' + id;
    } else {
      location.href = '#/';
    }
  }
}
