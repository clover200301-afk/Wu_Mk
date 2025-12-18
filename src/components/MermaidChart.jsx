import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

function MermaidChart({ chart }) {
  const ref = useRef(null);
  const [svg, setSvg] = React.useState('');
  const [error, setError] = React.useState(null);

  useEffect(() => {
    // 重新初始化 Mermaid，确保每次渲染都使用最新配置
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Arial, sans-serif',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
      },
      sequence: {
        useMaxWidth: true,
      },
      gantt: {
        useMaxWidth: true,
      },
    });

    if (chart) {
      const renderChart = async () => {
        try {
          setError(null);
          const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          // 清理可能存在的旧元素
          const oldElement = document.getElementById(id);
          if (oldElement) {
            oldElement.remove();
          }
          
          const { svg } = await mermaid.render(id, chart);
          setSvg(svg);
        } catch (err) {
          console.error('Mermaid rendering error:', err);
          setError(err.message || '图表渲染失败');
          setSvg('');
        }
      };
      renderChart();
    }
  }, [chart]);

  if (error) {
    // 静默失败，不显示错误信息
    return null;
  }

  return (
    <div 
      ref={ref} 
      className="mermaid-chart my-2 flex justify-center items-center max-w-full overflow-hidden"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export default MermaidChart;
