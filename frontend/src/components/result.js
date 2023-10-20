import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";

export class Result {

  constructor() {
    this.rightAnswers = null;
    const that = this;
    this.routeParams = UrlManager.getQueryParams();
    // document.getElementById('result-score').innerText = this.routeParams.score + '/' + this.routeParams.total;
    this.rightAnswers = document.getElementById('right-answers');
    this.rightAnswers.onclick = function () {
      that.showRightAnswers();
    }

    this.init();
  }

  async init() {
    const userInfo = Auth.getUserInfo();
    if (!userInfo) {
      location.href = '#/';
    }

    if (this.routeParams.id) {
      try {
        const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result?userId=' + userInfo.userId)

        if (result) {
          if (result.error) {
            throw new Error();
          }
          document.getElementById('result-score').innerText = result.score + '/' + result.total;
          return;
        }
      } catch (error) {
        console.log(error)
      }
      location.href = '#/';

    }
  }

  async showRightAnswers() {
    const userInfo = Auth.getUserInfo();
    console.log(userInfo)
    if (!userInfo) {
      location.href = '#/';
    }

    if (this.routeParams.id) {
      try {
        const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + userInfo.userId);
        console.log(result)

        if (result) {
          if (result.error) {
            throw new Error();
          }
            location.href = '#/check-result?id=' + this.routeParams.id;
          return;
        }
      } catch (error) {
        console.log(error)
      }
      location.href = '#/';

    }

    // this.routeParams = UrlManager.getQueryParams();
    // // console.log(url)
    // const score = this.routeParams.score;
    // const total = this.routeParams.total;
    // const id = this.routeParams.id;
    // if (score || total || id) {
    //   location.href = '#/check-result?score=' + score + '&total=' + total + '&id=' + id;
    // } else {
    //   location.href = '#/';
    // }
  }
}

