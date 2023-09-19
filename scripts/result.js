(function () {
  const Result = {
    rightAnswers: null,
    init() {
      const that = this;
      const url = new URL(location.href);
      console.log(url)
      document.getElementById('result-score').innerText = url.searchParams.get('score') + '/' + url.searchParams.get('total');
      this.rightAnswers = document.getElementById('right-answers');
      this.rightAnswers.onclick = function () {
        that.showRightAnswers();
      }

    },
    showRightAnswers() {
      const url = new URL(location.href);
      console.log(url)
      const score = url.searchParams.get('score');
      const total = url.searchParams.get('total');
      const id = url.searchParams.get('id');
      if (score || total || id) {
        location.href = 'check-result.html?score=' + score + '&total=' + total + '&id=' + id;
      } else {
        location.href = 'index.html';
      }
    }
  }

  Result.init();
})()