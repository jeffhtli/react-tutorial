var React = require('react');
var ReactDOM = require('react-dom');
var CommentBox = require('./tutorial.js');

ReactDOM.render(
  <CommentBox url='api/comments' />,
  document.getElementById('content')
);
