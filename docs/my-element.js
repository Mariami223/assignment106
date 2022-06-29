import {LitElement, html, css} from 'lit';
import {
  check,
  saveToStorage,
  loadFromStorage,
  clearStorage,
  deleteFromStorage,
} from './api/rand';

// saveToStorage promise
// deleteFromStorage promise

//loadFromStorage --
// clearStorage --

export class MyElement extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
      }
      .container {
        width: 100%;
        display: grid;
        padding: 84px;
        gap: 52px;
        grid-template-columns: 1fr 3fr 1fr;
      }

      .container > div {
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid rgb(223, 223, 223);
        box-shadow: rgb(0 0 0 / 20%) 0px 0px 12px;
        border-radius: 12px;
        padding: 12px;
      }

      .left {
        display: grid;
        grid-gap: 24px;
      }

      .left > span {
        display: flex;
        justify-content: space-between;
        gap: 12px;
      }

      .tweet {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin-bottom: 12px;
        border-bottom: 1px solid grey;
      }

      .title {
        font-size: 14px;
        font-weight: bold;
      }

      .post {
        font-size: 22px;
        color: gray;
      }
    `;
  }

  render() {
    return html`
      <div class="container">
        <div class="left">
          <span>
            Name:
            <input @input="${this.nameInput}" .value="${this.name || ''}" />
          </span>
          <span>
            Post:
            <textarea
              @input="${this.postInput}"
              .value="${this.post || ''}"
            ></textarea>
          </span>
          <span>
            <button @click="${this.postTweet}">Tweet</button>
          </span>
        </div>
        <div class="middle">
          ${this.tweets.map(
            (item, index) => html`
              <div class="tweet">
                <div class="title">${item.name}</div>
                <div class="post">${item.post}</div>
                <span
                  style="color: red; cursor: pointer"
                  @click="${() => this.DeleteTweet(index)}"
                  >Delete</span
                >
              </div>
            `
          )}
        </div>
        <div class="right">
          Posted
          <span style="font-weight: bold">${this.postCount || 0}</span> tweet
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      name: {
        type: String,
      },
      post: {
        type: String,
      },
      tweets: {
        type: Array,
      },
      postCount: {
        type: Number,
      },
    };
  }

  constructor() {
    super();
    this.tweets = loadFromStorage();
  }

  nameInput(event) {
    const name = event.target.value;
    this.name = name;
    console.log(name);
  }
  postInput(event) {
    const post = event.target.value;
    this.post = post;
    console.log(post);
  }

  postTweet() {
    this.tweet = {
      name: this.name,
      post: this.post,
    };
    this.tweets = [...this.tweets, {...this.tweet}];
    this.postCount = this.tweets.length;
    this.name = '';
    this.post = '';
    saveToStorage(this.tweet)
      .then((r) => {
        console.log(r);
      })
      .catch((e) => {
        console.log(e);
      });
    // აქ წესით მჭირდებოდა,მაგრამ რამდენად სწორად გავაკეთე არ ვიციი :დდ
  }

  DeleteTweet(index) {
    this.tweets.splice(index, 1);
    this.tweets = [...this.tweets];
    this.postCount = this.tweets.length;
    deleteFromStorage(index);
  }
}

window.customElements.define('my-element', MyElement);
