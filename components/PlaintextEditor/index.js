import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MDEditor from '@uiw/react-md-editor';
import css from './style.css';

function PlaintextEditor({ file, write, content, index, updateState }) {
  const [text, setText] = useState('');
  const [rendered, setRendered] = useState(false);
  useEffect(() => {
    // console.log('THIS IS THE INDEX', index);
    setText(content);
  }, [content]);

  const handleSave = async () => {
    await write(index, text, file.name, file.type);
  };
  return (
    <div className={css.editor}>
      <h3>Text Editor</h3>
      <textarea onChange={e => setText(e.target.value)} value={text} />
      <br />
      <button onClick={() => handleSave()}> Save Changes</button>
    </div>
  );
}

PlaintextEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default PlaintextEditor;
