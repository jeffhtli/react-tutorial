var React = require('react');
var $ = require('jquery');
var Remarkable = require('remarkable');

var CommentList = React.createClass({
  render: function() {
    var commentNode = this.props.data.map(function(comment) {
      return (
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
      )
    });
    return (
      <div className="commentList">
        {commentNode}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  getInitialState: function() {
    return {author:'', text: ''}
  },

  handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
  },

  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },

  handleSubmit: function(e){
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.setState({author: '', text: ''});
  },

  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={this.state.author}
          onChange={this.handleAuthorChange}
        />
        <input
          type="text"
          placeholder="Enter your comments..."
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <input type="submit" value="Post"/>
      </form>
    );
  }
});

var CommentBox = React.createClass({

  getInitialState: function() {
    return {data: []}
  },

  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data})
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    })
  },

  handleCommentSubmit: function(comment) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
      </div>
    );
  }
});

var Comment = React.createClass({
  rawMarkup: function() {
    var md = new Remarkable();
    var rawMarkup = md.render(this.props.children.toString());
    return { __html: rawMarkup };
  },

  render: function() {
    var md = new Remarkable();
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

module.exports = CommentBox;

