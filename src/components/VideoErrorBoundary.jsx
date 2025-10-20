import React, { useContext } from 'react';

class VideoErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Video error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <p style={{ color: 'red' }}>Could not load video.</p>;
    }

    return this.props.children;
  }
}

export default VideoErrorBoundary;
