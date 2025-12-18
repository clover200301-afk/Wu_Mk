import React, { useRef, useEffect, useImperativeHandle } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { 
  FaBold, 
  FaItalic, 
  FaStrikethrough, 
  FaHeading,
  FaCode,
  FaQuoteLeft,
  FaListUl,
  FaListOl,
  FaLink,
  FaImage,
  FaTable
} from 'react-icons/fa';

function Editor({ markdown, onChange, onScroll, scrollRef }) {
  const containerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const rafRef = useRef(null);
  const isScrollingFromSync = useRef(false); // 标记是否是同步触发的滚动
  
  // 暴露滚动方法给父组件 - 使用 requestAnimationFrame
  useEffect(() => {
    if (scrollRef) {
      scrollRef.current = (percentage) => {
        if (containerRef.current) {
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
          }
          
          // 标记为同步触发的滚动
          isScrollingFromSync.current = true;
          
          rafRef.current = requestAnimationFrame(() => {
            if (containerRef.current) {
              const maxScroll = containerRef.current.scrollHeight - containerRef.current.clientHeight;
              containerRef.current.scrollTop = maxScroll * percentage;
              
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
  }, [scrollRef]);
  
  // 监听滚动事件 - 忽略同步触发的滚动
  const handleScroll = () => {
    // 如果是同步触发的滚动，忽略
    if (isScrollingFromSync.current) {
      return;
    }
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    if (containerRef.current && onScroll) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const maxScroll = scrollHeight - clientHeight;
      const percentage = maxScroll > 0 ? scrollTop / maxScroll : 0;
      
      // 直接传递，不再使用 setTimeout
      onScroll(percentage, () => containerRef.current ? containerRef.current.scrollTop : null);
    }
  };
  const insertText = (before, after = '') => {
    const textarea = document.querySelector('textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const newText = markdown.substring(0, start) + before + selectedText + after + markdown.substring(end);
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const toolbarButtons = [
    { icon: FaBold, title: '粗体', action: () => insertText('**', '**') },
    { icon: FaItalic, title: '斜体', action: () => insertText('*', '*') },
    { icon: FaStrikethrough, title: '删除线', action: () => insertText('~~', '~~') },
    { icon: FaHeading, title: '标题', action: () => insertText('## ') },
    { icon: FaCode, title: '代码', action: () => insertText('`', '`') },
    { icon: FaQuoteLeft, title: '引用', action: () => insertText('> ') },
    { icon: FaListUl, title: '无序列表', action: () => insertText('- ') },
    { icon: FaListOl, title: '有序列表', action: () => insertText('1. ') },
    { icon: FaLink, title: '链接', action: () => insertText('[', '](url)') },
    { icon: FaImage, title: '图片', action: () => insertText('![alt](', ')') },
    { icon: FaTable, title: '表格', action: () => insertText('\n| 列1 | 列2 |\n|-----|-----|\n| 内容 | 内容 |\n') },
  ];

  return (
    <div className="h-full flex flex-col bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-2 flex-shrink-0">
        {toolbarButtons.map((btn, index) => (
          <button
            key={index}
            onClick={btn.action}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title={btn.title}
          >
            <btn.icon className="text-gray-700" />
          </button>
        ))}
      </div>
      
      <div className="flex-1 overflow-auto" ref={containerRef} onScroll={handleScroll}>
        <CodeEditor
          value={markdown}
          language="markdown"
          placeholder="请输入 Markdown 内容..."
          onChange={(e) => onChange(e.target.value)}
          padding={15}
          style={{
            fontSize: 14,
            backgroundColor: '#ffffff',
            fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace',
            minHeight: '100%',
          }}
        />
      </div>
    </div>
  );
}

export default Editor;
