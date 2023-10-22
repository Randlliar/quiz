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
    }
    xhr.send();
    this.getHtmlItems();
    this.backToResults = document.getElementById('result');
    this.backToResults.onclick = function () {
      that.goToResults();
    }
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
    }
    xhr.send();
  }


  async isError() {
    const userInfo = Auth.getUserInfo();
    console.log(userInfo)
    if (!userInfo) {
      location.href = '#/';
    }

    if (this.routeParams.id) {
      try {
        const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + userInfo.userId);
        for (let i = 0; i < result.test.questions.length; i++) {
          let selectedAnswer = result.test.questions[i].answers.find(item =>  item.correct !== undefined)
          if (selectedAnswer === undefined) {
            continue;
          }

          const checkResultOption = document.getElementById(selectedAnswer.id);

          if (selectedAnswer.correct === false) {
            let child = checkResultOption.firstChild;
            child.classList.add('wrong');
            checkResultOption.classList.add('wrong-answer');
          } else {
            let child = checkResultOption.firstChild;
            child.classList.add('right');
            checkResultOption.classList.add('right-answer');
          }
        }
      } catch (error) {
        console.log(error)
      }

    }
  }

  performer() {
    const userInfo = Auth.getUserInfo();
    const name = userInfo.fullName;
    const email = userInfo.email;
    const checkResultName = document.getElementById('check-result-name');
    checkResultName.innerText = ' ' + name + ', ' + email;
  }

  goToResults() {
    location.href = '#/result?id=' + this.routeParams.id;
  }
}
