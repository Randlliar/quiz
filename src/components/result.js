import {UrlManager} from "../utils/url-manager.js";

export class Result  {

    constructor() {
      this.rightAnswers = null;
      const that = this;
      this.routeParams = UrlManager.getQueryParams();
      // console.log(url)
      document.getElementById('result-score').innerText = this.routeParams.score + '/' + this.routeParams.total;
      this.rightAnswers = document.getElementById('right-answers');
      this.rightAnswers.onclick = function () {
        that.showRightAnswers();
      }

    }
    showRightAnswers() {
      this.routeParams = UrlManager.getQueryParams();
      // console.log(url)
      const score = this.routeParams.score;
      const total = this.routeParams.total;
      const id = this.routeParams.id;
      if (score || total || id) {
        location.href = '#/check-result?score=' + score + '&total=' + total + '&id=' + id;
      } else {
        location.href = '#/';
      }
    }
  }

