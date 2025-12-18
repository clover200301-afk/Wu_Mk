import React, { useState } from 'react';
import Header from './components/Header';
import Editor from './components/Editor';
import Preview from './components/Preview';
import AIModal from './components/AIModal';
import AboutModal from './components/AboutModal';

function App() {
  const [markdown, setMarkdown] = useState('# 欢迎使用 M Clover Markdown 编辑器\n\n开始编写你的 Markdown 内容...');
  const [showAIModal, setShowAIModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [leftWidth, setLeftWidth] = useState(50);
  const [deviceMode, setDeviceMode] = useState('desktop'); // desktop, tablet, mobile
  const [syncScroll, setSyncScroll] = useState(true);
  const editorScrollRef = React.useRef(null);
  const previewScrollRef = React.useRef(null);
  
  // 同步状态管理
  const syncStateRef = React.useRef({
    isAnimating: false,        // 是否正在执行同步动画
    sourceId: null,            // 滚动源 ID (editor/preview)
  });
  
  const scrollEndTimeoutRef = React.useRef(null);
  const animationFrameRef = React.useRef(null);
  
  const handleAIGenerate = (generatedMarkdown) => {
    setMarkdown(generatedMarkdown);
    setShowAIModal(false);
  };

  const handleGmail = () => {
    window.open('mailto:Clover200301@gmail.com', '_blank');
  };

  const handleGithub = () => {
    window.open('https://github.com/clover200301-afk', '_blank');
  };

  const handleWechat = () => {
    alert('微信公众号 Markdown 编辑功能开发中...');
  };

  // 高阶缓动函数
  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };
  
  // 智能同步算法 - 基于位置的自适应同步
  const smartSync = (sourcePercentage, targetScrollFn) => {
    if (!targetScrollFn || syncStateRef.current.isAnimating) return;
    
    syncStateRef.current.isAnimating = true;
    const targetPercentage = sourcePercentage;
    
    // 使用平滑缓动
    const duration = 300; // 300ms 动画时长
    const startTime = performance.now();
    let lastProgress = 0;
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      
      // 应用缓动
      const easedProgress = easeInOutCubic(rawProgress);
      const currentPercentage = easedProgress * targetPercentage;
      
      // 只在有明显变化时更新，减少不必要的重绘
      if (Math.abs(easedProgress - lastProgress) > 0.001) {
        targetScrollFn(currentPercentage);
        lastProgress = easedProgress;
      }
      
      // 继续动画
      if (rawProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        syncStateRef.current.isAnimating = false;
      }
    };
    
    // 取消之前的动画
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(animate);
  };
  
  // 编辑器滚动处理 - 被动监听，滚动结束后同步
  const handleEditorScroll = (scrollPercentage, getCurrentScrollTop) => {
    if (!syncScroll || syncStateRef.current.isAnimating) return;
    if (syncStateRef.current.sourceId === 'preview') return; // 防止循环
    
    // 标记滚动源
    syncStateRef.current.sourceId = 'editor';
    
    // 清除之前的定时器
    if (scrollEndTimeoutRef.current) {
      clearTimeout(scrollEndTimeoutRef.current);
    }
    
    // Debounce: 滚动停止后 200ms 触发同步
    scrollEndTimeoutRef.current = setTimeout(() => {
      // 执行同步
      smartSync(scrollPercentage, previewScrollRef.current);
      syncStateRef.current.sourceId = null;
    }, 200);
  };

  // 预览滚动处理 - 被动监听，滚动结束后同步
  const handlePreviewScroll = (scrollPercentage, getCurrentScrollTop) => {
    if (!syncScroll || syncStateRef.current.isAnimating) return;
    if (syncStateRef.current.sourceId === 'editor') return; // 防止循环
    
    // 标记滚动源
    syncStateRef.current.sourceId = 'preview';
    
    // 清除之前的定时器
    if (scrollEndTimeoutRef.current) {
      clearTimeout(scrollEndTimeoutRef.current);
    }
    
    // Debounce: 滚动停止后 200ms 触发同步
    scrollEndTimeoutRef.current = setTimeout(() => {
      // 执行同步
      smartSync(scrollPercentage, editorScrollRef.current);
      syncStateRef.current.sourceId = null;
    }, 200);
  };
  
  // 组件卸载时清理
  React.useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (scrollEndTimeoutRef.current) {
        clearTimeout(scrollEndTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      <Header 
        onAIClick={() => setShowAIModal(true)}
        onWechatClick={handleWechat}
        onGmailClick={handleGmail}
        onGithubClick={handleGithub}
        onAboutClick={() => setShowAboutModal(true)}
      />
      
      <div className="flex-1 flex overflow-hidden p-2 gap-2 bg-gray-100 min-h-0">
        <div style={{ width: `${leftWidth}%` }} className="h-full min-h-0">
          <Editor 
            markdown={markdown} 
            onChange={setMarkdown}
            onScroll={handleEditorScroll}
            scrollRef={editorScrollRef}
          />
        </div>
        
        <div 
          className="w-1 bg-gray-400 hover:bg-blue-500 cursor-col-resize transition-colors rounded-full"
          onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startWidth = leftWidth;
            
            const handleMouseMove = (e) => {
              const delta = e.clientX - startX;
              const newWidth = startWidth + (delta / window.innerWidth) * 100;
              setLeftWidth(Math.max(20, Math.min(80, newWidth)));
            };
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />
        
        <div style={{ width: `${100 - leftWidth}%` }} className="h-full min-h-0">
          <Preview 
            markdown={markdown} 
            deviceMode={deviceMode}
            onDeviceModeChange={setDeviceMode}
            onScroll={handlePreviewScroll}
            scrollRef={previewScrollRef}
          />
        </div>
      </div>

      {showAIModal && (
        <AIModal 
          onClose={() => setShowAIModal(false)}
          onGenerate={handleAIGenerate}
        />
      )}

      {showAboutModal && (
        <AboutModal onClose={() => setShowAboutModal(false)} />
      )}
    </div>
  );
}

export default App;
