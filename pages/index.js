import React, { useState, useEffect } from 'react';
import App from 'next/app';
import Head from 'next/head';
import PropTypes from 'prop-types';
import path from 'path';
import classNames from 'classnames';
import Markdown from 'markdown-to-jsx';

import { Provider } from 'react-redux';
import { createWrapper } from 'next-redux-wrapper';
import { listFiles } from '../files';
// import { Markdown } from 'markdown-to-html';
// Used below, these need to be registered
import PlaintextEditor from '../components/PlaintextEditor';
import MarkdownEditor from '../MarkdownEditor';
import IconPlaintextSVG from '../public/icon-plaintext.svg';
import IconMarkdownSVG from '../public/icon-markdown.svg';
import IconJavaScriptSVG from '../public/icon-javascript.svg';
import IconJSONSVG from '../public/icon-json.svg';
import MDEditor from '@uiw/react-md-editor';

import css from './style.module.css';

const TYPE_TO_ICON = {
  'text/plain': IconPlaintextSVG,
  'text/markdown': IconMarkdownSVG,
  'text/javascript': IconJavaScriptSVG,
  'application/json': IconJSONSVG
};

function FilesTable({ files, activeFile, setActiveFile, setCurrentIndex }) {
  // console.log(file1);
  return (
    <div className={css.files}>
      <table>
        <thead>
          <tr>
            <th>File</th>
            <th>Modified</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr
              key={file.name}
              className={classNames(
                css.row,
                activeFile && activeFile.name === file.name ? css.active : ''
              )}
              onClick={() => {
                setCurrentIndex(index);
                setActiveFile(file);
              }}
            >
              <td className={css.file}>
                <div
                  className={css.icon}
                  dangerouslySetInnerHTML={{
                    __html: TYPE_TO_ICON[file.type]
                  }}
                ></div>
                {path.basename(file.name)}
              </td>

              <td>
                {new Date(file.lastModified).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

FilesTable.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object),
  activeFile: PropTypes.object,
  setActiveFile: PropTypes.func
};

function Previewer({ file, index, write, updateState }) {
  const [value, setValue] = useState('');
  const [fileType, setFileType] = useState('');
  // console.log('PREVIEWER COMPONENT RERENDERED');
  useEffect(() => {
    (async () => {
      // console.log('WE ENTERED HERE!');
      const text = await file.text();
      // console.log('THIS IS THE TEXT', text);
      setValue(text);
      setFileType(file.type);
    })();
  });

  return (
    <div>
      <PlaintextEditor
        write={write}
        index={index}
        file={file}
        content={value}
      />
      <br />
      {/* <MarkdownEditor filetype={fileType} content={value} />
      <br /> */}
      {/* <br /> */}
      {/* if (filetype == 'text/plain' || filetype == 'text/markdown') */}
      <div className={css.preview}>
        <div className={css.title}>
          {`${path.basename(file.name)} `}
          {file.type == 'text/plain' || file.type == 'text/markdown'
            ? '  (Markdown Rendering)'
            : '(Markdown not supported for file type)'}{' '}
        </div>
        <div
          // dangerouslySetInnerHTML={{ __html: 'First &middot; Second' }}
          className={css.content}
        >
          <Markdown>{value}</Markdown>
          {/* {value}{' '} */}
        </div>
      </div>
    </div>
  );
}

Previewer.propTypes = {
  file: PropTypes.object
};

// Uncomment keys to register editors for media types
const REGISTERED_EDITORS = {
  // "text/plain": PlaintextEditor,
  // "text/markdown": MarkdownEditor,
};

function PlaintextFilesChallenge() {
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [currentIndex, setCurrentIndex] = useState();
  useEffect(() => {
    const files = listFiles();
    setFiles(files);
  }, []);

  const write = async (index, text, name, type) => {
    // console.log('Writing soon... ', file.name);
    // const newFile = new File(`${text}`, '/document.json', {
    //   type: 'application/json',
    //   lastModified: new Date('2011-07-29T16:01:35')
    // });
    const arr = files.map((file, indexing) => {
      if (index !== indexing) {
        return file;
      } else {
        const newFile = new File([text], name, {
          type,
          lastModified: new Date()
        });
        // console.log('THIS IS THE NEW FILE', newFile);
        return newFile;
      }
    });
    setActiveFile(arr[currentIndex]);
    setFiles(arr);
    // console.log('CURRENT TEXT', await files[currentIndex].text());
    // TODO: Write the file to the `files` array
  };

  const Editor = activeFile ? REGISTERED_EDITORS[activeFile.type] : null;

  return (
    <div className={css.page}>
      <Head>
        <title>Rethink Engineering Challenge</title>
      </Head>
      <aside>
        <header>
          <div className={css.tagline}>Rethink Engineering Challenge</div>
          <h1>Fun With Plaintext</h1>
          <div className={css.description}>
            Let{"'"}s explore files in JavaScript. What could be more fun than
            rendering and editing plaintext? Not much, as it turns out.
          </div>
        </header>

        <FilesTable
          files={files}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
          setCurrentIndex={setCurrentIndex}
        />

        <div style={{ flex: 1 }}></div>

        <footer>
          <div className={css.link}>
            <a href="https://v3.rethink.software/jobs">Rethink Software</a>
            &nbsp;—&nbsp;Frontend Engineering Challenge
          </div>
          <div className={css.link}>
            Questions? Feedback? Email us at jobs@rethink.software
          </div>
        </footer>
      </aside>

      <main className={css.editorWindow}>
        {activeFile && (
          <>
            {Editor && <Editor file={activeFile} write={write} />}
            {!Editor && (
              <Previewer write={write} index={currentIndex} file={activeFile} />
            )}
          </>
        )}

        {!activeFile && (
          <div className={css.empty}>Select a file to view or edit</div>
        )}
      </main>
    </div>
  );
}

export default PlaintextFilesChallenge;
