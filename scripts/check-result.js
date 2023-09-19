(function () {
  const CheckResult = {
    answers: [],
    test: [],
    questions: [],
    init() {
      // checkUserData();
      const url = new URL(location.href);
      const testId = url.searchParams.get('id');
      //
      console.log(testId)

      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://testologia.site/get-quiz-right?id=' + testId, false);
      xhr.send();
      console.log(xhr.responseText)
      if (xhr.status === 200 && xhr.responseText) {
        try {
          this.answers = JSON.parse(xhr.responseText);
          console.log(this.answers)
        } catch (e) {
          location.href = 'index.html';
        }
        // this.getAnswers();
      } else {
        location.href = 'index.html';
      }
      // this.getQuestions();
      this.getPreTitle();
    },
    getPreTitle() {
      const url = new URL(location.href);
      const testId = url.searchParams.get('id');
      console.log(testId)
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://testologia.site/get-quiz?id=' + testId, false);
      xhr.send();
      this.test = JSON.parse(xhr.responseText);
      document.getElementById('pre-title').innerText = this.test.name;
      this.test.questions.forEach(item => {
        // console.log(item.question);
        // console.log(item.answers);
        const checkResultQuestions = document.getElementById('check-result-questions')
        const checkResultQuestion = document.createElement('div');
        checkResultQuestion.className = ('check-result-question');
        const checkResultQuestionTitleSpan = document.createElement('span');
        const checkResultQuestionTitle = document.createElement('div');
        checkResultQuestionTitle.innerText = "Вопрос " + item.id + ': ';
        checkResultQuestionTitle.className = ('check-result-question-title');
        checkResultQuestionTitleSpan.innerText =  item.question;
        checkResultQuestionTitle.appendChild(checkResultQuestionTitleSpan)
        checkResultQuestion.appendChild(checkResultQuestionTitle);
        checkResultQuestions.appendChild(checkResultQuestion);


        item.answers.find(answers => {
          // console.log(answers.answer);


          const checkResultOption = document.createElement('div');
          checkResultOption.className = ('check-result-question-option');

          const checkResultOptionAnswerLabel = document.createElement('label');
          const checkResultOptionAnswerInput = document.createElement('div');

          // checkResultOptionAnswerInput.setAttribute('type', 'radio');
          // checkResultOptionAnswerInput.setAttribute('name', 'answer');
          // checkResultOptionAnswerInput.setAttribute('disabled', 'disabled');

          checkResultOptionAnswerInput.className = ('check-box');
          checkResultOptionAnswerLabel.innerText = answers.answer;
          checkResultOption.appendChild(checkResultOptionAnswerInput);
          checkResultOption.appendChild(checkResultOptionAnswerLabel);
          checkResultQuestion.appendChild(checkResultOption);
        })

      })
    }
  }
  CheckResult.init();
})()