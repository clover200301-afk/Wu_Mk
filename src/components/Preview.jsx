import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import { FaMobileAlt, FaTabletAlt, FaDesktop } from 'react-icons/fa';
import MermaidChart from './MermaidChart';
import EChartsRenderer from './EChartsRenderer';
import 'highlight.js/styles/github.css';
import 'katex/dist/katex.min.css';

function Preview({ markdown, deviceMode, onDeviceModeChange, onScroll, scrollRef }) {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const rafRef = useRef(null);
  const isScrollingFromSync = useRef(false); // 标记是否是同步触发的滚动
  
  // 暴露滚动方法给父组件 - 使用 requestAnimationFrame
  useEffect(() => {
    if (scrollRef) {
      scrollRef.current = (percentage) => {
        const scrollElement = deviceMode === 'desktop' ? containerRef.current : contentRef.current;
        if (scrollElement) {
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
          }
          
          // 标记为同步触发的滚动
          isScrollingFromSync.current = true;
          
          rafRef.current = requestAnimationFrame(() => {
            if (scrollElement) {
              const maxScroll = scrollElement.scrollHeight - scrollElement.clientHeight;
              scrollElement.scrollTop = maxScroll * percentage;
              
              // 延迟重置标记，给滚动事件时间处理
              setTimeout(() => {
                isScrollingFromSync.current = false;
              }, 50);
            }
          });
        }
      };
    }
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [scrollRef, deviceMode]);
  
  // 监听滚动事件 - 忽略同步触发的滚动
  const handleScroll = (e) => {
    // 如果是同步触发的滚动，忽略
    if (isScrollingFromSync.current) {
      return;
    }
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    const target = e.target;
    if (onScroll) {
      const { scrollTop, scrollHeight, clientHeight } = target;
      const maxScroll = scrollHeight - clientHeight;
      const percentage = maxScroll > 0 ? scrollTop / maxScroll : 0;
      
      // 直接传递，不再使用 setTimeout
      onScroll(percentage, () => {
        const scrollElement = deviceMode === 'desktop' ? containerRef.current : contentRef.current;
        return scrollElement ? scrollElement.scrollTop : null;
      });
    }
  };
  
  const deviceModes = [
    { id: 'mobile', icon: FaMobileAlt, title: 'iPhone 16 Pro', width: '393px' },
    { id: 'tablet', icon: FaTabletAlt, title: 'iPad Pro', width: '768px' },
    { id: 'desktop', icon: FaDesktop, title: 'MacBook Pro', width: '100%' },
  ];

  return (
    <div className="h-full flex flex-col bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 p-2 flex items-center justify-center gap-4 flex-shrink-0">
        {deviceModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onDeviceModeChange(mode.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded transition-all ${
              deviceMode === mode.id
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
            title={mode.title}
          >
            <mode.icon />
            <span className="hidden sm:inline">{mode.title}</span>
          </button>
        ))}
      </div>
      
      {deviceMode === 'desktop' ? (
        <div 
          className="flex-1 overflow-auto"
          ref={containerRef}
          onScroll={handleScroll}
        >
          <div className="markdown-preview">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeHighlight]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  const code = String(children).replace(/\n$/, '');
                  
                  if (!inline && language === 'mermaid') {
                    return <MermaidChart chart={code} />;
                  }
                  
                  if (!inline && (language === 'echarts' || language === 'echart')) {
                    return <EChartsRenderer config={code} />;
                  }
                  
                  return !inline && match ? (
                    <pre className={className} {...props}>
                      <code className={className}>{children}</code>
                    </pre>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto flex items-start justify-center p-2">
          <div
            className="bg-white shadow-lg rounded-lg overflow-auto"
            style={{
              width: deviceModes.find(m => m.id === deviceMode)?.width || '100%',
              maxWidth: '100%',
              minHeight: '500px',
            }}
            ref={contentRef}
            onScroll={handleScroll}
          >
            <div className="markdown-preview">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeHighlight]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1] : '';
                    const code = String(children).replace(/\n$/, '');
                    
                    if (!inline && language === 'mermaid') {
                      return <MermaidChart chart={code} />;
                    }
                    
                    if (!inline && (language === 'echarts' || language === 'echart')) {
                      return <EChartsRenderer config={code} />;
                    }
                    
                    return !inline && match ? (
                      <pre className={className} {...props}>
                        <code className={className}>{children}</code>
                      </pre>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Preview;
