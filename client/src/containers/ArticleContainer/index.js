import React, { Component } from 'react';
import './Article.css';
import marked from 'marked';

import { createClient } from 'contentful';

// Contentful read-only token
const SPACE_ID = 'wb0iqsd023ks';
const ACCESS_TOKEN = '943872b949f9300a341513cc498473efe36b1c8fdffe9f1886b18606bd1363cc';

class Article extends Component {
  constructor(props) {
    super(props);

    this.parseMarkdown = this.parseMarkdown.bind(this);

    this.client = createClient({
      // This is the space ID. A space is like a project folder in Contentful terms
      space: SPACE_ID,
      // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
      accessToken: ACCESS_TOKEN
    });

    this.state = {
      articleBody: null,
      articleTitle: null,
      author: null,
      dateCreated: null,
    };
  }

  componentDidMount() {
    const postId = this.props.location.pathname.split('/').pop();
    this.client.getEntries()
      .then((entry) => {
        for (var i = 0; i < entry.items.length; i++){
          if (entry.items[i].fields.slug === postId) {
            return this.setState({
              articleBody: entry.items[i].fields.articleBody,
              articleTitle: entry.items[i].fields.articleTitle,
              author: entry.items[i].fields.author,
              dateCreated: entry.items[i].fields.dateCreated
            });
          }
        }
      })
      .catch((err) => {
        console.log('error', err);
      });
  }

  parseMarkdown() {
    return {
      __html: marked(this.state.articleBody, { sanitize: true })
    };
  }

  render() {
    return (
      <div className="article-container">
        <h1>{this.state.articleTitle}</h1>
        <div>{this.state.author}</div>
        <div>{this.state.dateCreated}</div>
        {this.state.articleBody ? <div dangerouslySetInnerHTML={this.parseMarkdown()} /> : ''}
      </div>
    )
  }
}
export default Article;