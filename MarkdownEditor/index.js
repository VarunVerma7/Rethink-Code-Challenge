import React from 'react';
import PropTypes from 'prop-types';
import MDEditor from '@uiw/react-md-editor';

import css from './style.css';

function MarkdownEditor({ file, write, content, filetype }) {
  if (filetype == 'text/plain' || filetype == 'text/markdown') {
    return (
      <div className={css.editor}>
        <h3>Markdown Viewer</h3>
        {/* <p>{content}</p> */}
      </div>
    );
  } else {
    return (
      <div className={css.editor}>
        {filetype === 'text/markdown'}
        No Markdown supported for this type of file
      </div>
    );
  }
}

MarkdownEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default MarkdownEditor;
