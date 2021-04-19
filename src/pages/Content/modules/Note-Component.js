import React from 'react';

function Note(props) {
  return (
    <div className="note" key={props.key} style={{ textAlign: 'left' }}>
      <p style={{ marginBottom: 0 }}>{props.content}</p>
      <span
        style={{
          margin: 0,
          marginLeft: '20px',
          fontSize: '8pt',
          color: 'grey',
        }}
      >
        At time: {props.time}
      </span>
    </div>
  );
}

export default Note;
