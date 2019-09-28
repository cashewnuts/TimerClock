import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.log(this.state, this);
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h1>Something went wrong.</h1>
          {this.state.error && (
            <h2>{JSON.stringify(this.state.error.message)}</h2>
          )}
          <div>
            {this.state.errorInfo &&
              this.state.errorInfo.componentStack.split('\n').map(line => {
                return <p>{line}</p>;
              })}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
