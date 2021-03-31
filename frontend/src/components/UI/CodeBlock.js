import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import beautify from 'js-beautify';
import styles from './CodeBlock.module.css';

function CodeBlock(props) {
    const codeBlock = useRef(null);

    useEffect(() => {
        const code = beautify(props.children);

        codeBlock.current.innerHTML = code;

        hljs.highlightElement(codeBlock.current);
    }, [props.children]);

    return (
        <pre className={styles.pre}>
            <code className={styles.code} ref={codeBlock}></code>
        </pre>
    );
}

export default CodeBlock;
