import React from 'react';
import ReactECharts from 'echarts-for-react';

function EChartsRenderer({ config }) {
  const [option, setOption] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    try {
      // 尝试解析 JSON 配置
      let parsedConfig;
      if (typeof config === 'string') {
        parsedConfig = JSON.parse(config);
      } else {
        parsedConfig = config;
      }
      
      setOption(parsedConfig);
      setError(null);
    } catch (err) {
      console.error('ECharts config parse error:', err);
      setError(err.message || '配置解析失败');
    }
  }, [config]);

  if (error) {
    // 静默失败，不显示错误信息
    return null;
  }

  if (!option) {
    return null;
  }

  return (
    <div className="my-2">
      <ReactECharts
        option={option}
        style={{ height: '380px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
}

export default EChartsRenderer;
