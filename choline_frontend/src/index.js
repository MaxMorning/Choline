import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ConfigProvider, theme } from 'antd';
import zh_CN from 'antd/es/locale/zh_CN';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider locale={zh_CN} theme={{ algorithm: theme.darkAlgorithm }}>
    <App />
  </ConfigProvider>
);
