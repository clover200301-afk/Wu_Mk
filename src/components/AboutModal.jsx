import React from 'react';
import { FaTimes } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function AboutModal({ onClose }) {
  const readmeContent = `# M Clover - 在线 Markdown 编辑器

## 项目简介

M Clover 是一个功能强大的在线 Markdown 编辑器，提供实时预览、多设备预览模式以及 AI 辅助生成等功能。

## 核心功能

### 1. 实时编辑与预览
- 左侧编辑器支持实时 Markdown 编辑
- 右侧预览窗口实时渲染 Markdown 内容
- 可拖动分割线自由调整编辑器和预览窗口的比例

### 2. Markdown 工具栏
提供完整的 Markdown 格式化工具，包括：
- **粗体**、*斜体*、~~删除线~~
- 标题、代码、引用
- 无序列表、有序列表
- 链接、图片、表格

### 3. 多设备预览模式
- 📱 iPhone 16 Pro 模式（393px）
- 📱 iPad Pro 模式（768px）
- 💻 MacBook Pro 模式（全屏）

### 4. AI 智能助手
- 输入主题，AI 自动生成标准 Markdown 模板
- 包含完整的文档结构（标题、简介、特点、示例等）
- 快速开始写作，提高效率

### 5. 快捷功能
- **Gmail**: 快速发送邮件至 Clover200301@gmail.com
- **GitHub**: 访问项目作者的 GitHub 主页
- **微信公众号**: 微信公众号 Markdown 编辑（开发中）

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **样式方案**: Tailwind CSS
- **Markdown 渲染**: marked.js
- **代码编辑器**: @uiw/react-textarea-code-editor
- **图标库**: React Icons

## 作者信息

- **作者**: Clover
- **邮箱**: Clover200301@gmail.com
- **GitHub**: [https://github.com/clover200301-afk](https://github.com/clover200301-afk)

## 开源协议

MIT License

---

**© 2024 M Clover. All rights reserved.**
`;

  const html = readmeContent;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">关于项目</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <div
            className="markdown-preview"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {html}
            </ReactMarkdown>
          </div>
        </div>
        
        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

export default AboutModal;
