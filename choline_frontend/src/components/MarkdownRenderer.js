import React, { useState } from 'react';
import { Terminal } from 'lucide-react';
import { Button, message, Typography, Flex, Card } from 'antd';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight'

import "highlight.js/styles/atom-one-light.css";

const { Text, Link } = Typography;

const CopyButton = ({ id }) => {  
    const onCopy = async () => {
      try {
        const text = document.getElementById(id).textContent;
        await navigator.clipboard.writeText(text);
      } catch (error) {
        // console.log(error);
      }
    };

    return (
      <Link
        onClick={onCopy}
      >
        复制代码
      </Link>
    );
  };

const MarkdownRenderer = ({ markdown }) => {
  return (
    <ReactMarkdown rehypePlugins={[rehypeHighlight]}

    components={{
        // pre: ({ children }) => <pre className="not-prose">{children}</pre>,
        code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            if (match?.length) {
                const id = Math.random().toString(36).substr(2, 9);
                return (
                    <Card title={
                        <Flex align='center' gap='small'>
                            <Terminal size={15} />
                            <Text>{match.at(-1)}</Text>
                        </Flex>
                        } extra={<CopyButton id={id} />}
                        style={{backgroundColor: '#E0E0E0'}}>
                            <code id={id}>
                                {children}
                            </code>
                    </Card>
                );
            } else {
                return (
                    <code
                        {...props}
                    >
                        {children}
                    </code>
                );
            }
            },
      }}
      >
      {markdown}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;