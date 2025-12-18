import React, { useState } from 'react';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';

function AIModal({ onClose, onGenerate }) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert('请输入主题');
      return;
    }

    setLoading(true);
    
    // 模拟 AI 生成（实际应用中应该调用真实的 AI API）
    setTimeout(() => {
      const generatedMarkdown = `# ${topic}

## 简介

这是关于 ${topic} 的详细介绍。

## 主要特点

- **特点一**: 这是第一个重要特点
- **特点二**: 这是第二个重要特点
- **特点三**: 这是第三个重要特点

## 详细说明

### 基础概念

${topic} 是一个重要的概念，它在现代技术中扮演着关键角色。

### 应用场景

1. 场景一：描述第一个应用场景
2. 场景二：描述第二个应用场景
3. 场景三：描述第三个应用场景

## 示例代码

\`\`\`javascript
// 这是一个示例代码
function example() {
  console.log("Hello, ${topic}!");
}
\`\`\`

## 总结

通过本文，我们了解了 ${topic} 的基本概念和应用。希望这些内容对你有所帮助。

---

*生成时间: ${new Date().toLocaleString('zh-CN')}*
`;
      
      onGenerate(generatedMarkdown);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">AI 助手</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
        
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            请输入主题
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例如：人工智能、区块链技术、Web 开发..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="4"
          />
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>提示：</strong>AI 将根据你提供的主题生成一个标准的 Markdown 文档模板，包括标题、简介、特点、详细说明等部分。
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <FaPaperPlane />
            <span>{loading ? '生成中...' : '生成 Markdown'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIModal;
