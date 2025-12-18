import React from 'react';
import { 
  FaRobot, 
  FaWeixin, 
  FaEnvelope, 
  FaGithub, 
  FaInfoCircle 
} from 'react-icons/fa';

function Header({ onAIClick, onWechatClick, onGmailClick, onGithubClick, onAboutClick }) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold">M Clover</span>
          <span className="text-sm opacity-90">- 在线 Markdown 编辑器</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={onAIClick}
            className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 hover:scale-105"
            title="AI 助手"
          >
            <FaRobot className="text-xl" />
            <span className="hidden md:inline">AI</span>
          </button>
          
          <button
            onClick={onWechatClick}
            className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 hover:scale-105"
            title="微信公众号"
          >
            <FaWeixin className="text-xl" />
            <span className="hidden md:inline">微信</span>
          </button>
          
          <button
            onClick={onGmailClick}
            className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 hover:scale-105"
            title="Gmail"
          >
            <FaEnvelope className="text-xl" />
            <span className="hidden md:inline">Gmail</span>
          </button>
          
          <button
            onClick={onGithubClick}
            className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 hover:scale-105"
            title="GitHub"
          >
            <FaGithub className="text-xl" />
            <span className="hidden md:inline">GitHub</span>
          </button>
          
          <button
            onClick={onAboutClick}
            className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 hover:scale-105"
            title="关于"
          >
            <FaInfoCircle className="text-xl" />
            <span className="hidden md:inline">关于</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
