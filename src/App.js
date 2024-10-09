import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    users: [],
    selectedUser: null,
    post: null,
    comments: [],
    title: '',
    body: '',
    loading: false,
    error: null,
  };

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      this.setState({ users: data });
    } catch (error) {
      this.setState({ error: 'Failed to load users' });
    }
  };

  handleCreatePost = async () => {
    const { selectedUser, title, body } = this.state;

    if (!selectedUser || !title || !body) {
      this.setState({ error: 'Please fill all fields and select a user' });
      return;
    }

    this.setState({ loading: true, error: null });

    try {
      const postResponse = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({
          title,
          body,
          userId: selectedUser.id,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const newPost = await postResponse.json();

      const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${newPost.id}`);
      const comments = await commentsResponse.json();

      this.setState({
        post: newPost,
        comments,
        loading: false,
        error: null,
      });
    } catch (err) {
      this.setState({ error: 'Failed to create post or fetch comments', loading: false });
    }
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSelectUser = (user) => {
    this.setState({ selectedUser: user });
  };

  render() {
    const { users, selectedUser, post, comments, title, body, loading, error } = this.state;

    return (
      <div className="container">
        <h1>API Chaining Demo</h1>

        {loading && <p className="loading-message">Loading...</p>}
        {error && <p className="error-message">Error: {error}</p>}

        <div className="mt-6">
          <h2>Create a New Post</h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              name="title"
              value={title}
              onChange={this.handleInputChange}
              placeholder="Post Title"
            />
            <textarea
              name="body"
              value={body}
              onChange={this.handleInputChange}
              placeholder="Post Body"
              rows={4}
              className="textarea"
            />
          </div>
        </div>

        <div className="user-selection">
          <h2>Select a User</h2>
          <div className="user-button-container">
            {users.map((user) => (
              <button key={user.id} onClick={() => this.handleSelectUser(user)} className="user-button">
                {user.name}
              </button>
            ))}
          </div>
        </div>

        {selectedUser && (
          <div className="mt-4">
            <p>
              <strong>Selected User:</strong> {selectedUser.name}
            </p>
          </div>
        )}

        <div className="mt-4">
          <button onClick={this.handleCreatePost}>Create Post</button>
        </div>

        {post && (
          <div className="post-section">
            <h3>Post Created:</h3>
            <p className="post-title">{post.title}</p>
            <p>{post.body}</p>

            <div className="comment-section">
              <h3>Comments:</h3>
              {comments.map((comment) => (
                <div key={comment.id} className="comment">
                  {comment.body}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
