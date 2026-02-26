/**
 * 错误边界组件 - 捕获子组件错误
 */

import React, { Component, ReactNode } from 'react';
import { View, Text, Button } from '@tarojs/taro';
import './errorBoundary.scss';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * 错误边界组件
 * 捕获子组件渲染过程中的错误，提供降级 UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('[ErrorBoundary] 捕获错误:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View className="error-boundary">
          <View className="error-content">
            <Text className="error-icon">⚠️</Text>
            <Text className="error-title">页面出错了</Text>
            <Text className="error-message">
              {this.state.error?.message || '加载失败，请稍后重试'}
            </Text>
            <Button className="error-retry-btn" onClick={this.handleRetry}>
              重新加载
            </Button>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

/**
 * 错误降级 UI 组件
 */
export const ErrorFallback: React.FC<{
  message?: string;
  onRetry?: () => void;
}> = ({ message = '加载失败', onRetry }) => {
  return (
    <View className="error-fallback">
      <Text className="error-fallback-icon">📭</Text>
      <Text className="error-fallback-message">{message}</Text>
      {onRetry && (
        <Button className="error-fallback-btn" onClick={onRetry}>
          点击重试
        </Button>
      )}
    </View>
  );
};

export default ErrorBoundary;
