import React, { useState } from 'react';
import { Copy, Check, Terminal } from "lucide-react";
import { Button, message } from 'antd';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight'

import "highlight.js/styles/atom-one-dark.css";

const CopyButton = ( id ) => {
    const [copied, setCopited] = useState(false);
  
    const onCopy = async () => {
      try {
        setCopited(true);
        const text = document.getElementById(id).innerText;
        await navigator.clipboard.writeText(text);
        setTimeout(() => {
          setCopited(false);
        }, 1000);
      } catch (error) {
        console.log(error);
      }
    };
  
    return (
      <button
        onClick={onCopy}
        className="inline-flex rounded-md p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800"
      >
        <Copy
            size={16}
            className={`transition-all
            ${copied ? "scale-0" : "scale-100"}
        `}
        />
        <Check
            size={16}
            className={`absolute transition-all ${
            copied ? "scale-100" : "scale-0"
            }`}
        />
      </button>
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
                    <div className="not-prose rounded-md border">
                        <div className="flex h-12 items-center justify-between bg-zinc-100 px-4 dark:bg-zinc-900">
                        <div className="flex items-center gap-2">
                            <Terminal size={18} />
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {node?.data?.meta}
                            </p>
                        </div>
                        <CopyButton id={id} />
                        </div>
                        <div className="overflow-x-auto">
                        <div id={id} className="p-4">
                            {children}
                        </div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <code
                        {...props}
                        className="not-prose rounded bg-gray-100 px-1 dark:bg-zinc-900"
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