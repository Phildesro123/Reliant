import React from 'react';

function Note(props) {
  return (
    <div className="note" style={{ textAlign: 'left' }}>
      <p style={{ marginBottom: 0, fontSize: '11pt', lineHeight: 'normal' }}>
        {props.content}
      </p>
      <span
        style={{
          margin: 0,
          marginLeft: '15px',
          fontSize: '8pt',
          color: 'lightgrey',
        }}
      >
        {props.time}
      </span>
    </div>
  );
}

export default Note;
