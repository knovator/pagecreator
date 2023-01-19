/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import classNames from 'classnames';
import JoditEditor from 'jodit-react';
import { HTMLEditorProps } from '../../../types';

const App = ({
  label,
  wrapperClassName,
  required,
  value,
  error,
  onChange,
}: HTMLEditorProps) => {
  return (
    <div className={classNames('khb_input-wrapper', wrapperClassName)}>
      {label && (
        <label className="khb_input-label">
          {label}
          {required ? (
            <span className="khb_input-label-required">*</span>
          ) : null}
        </label>
      )}
      <JoditEditor
        value={value || ''}
        config={{
          buttons: ['bold', 'italic', 'align', 'brush', 'undo', 'redo'],
        }}
        onBlur={(newContent: string) => onChange(newContent)}
      />
      {error && <p className="khb_input-error ">{error}</p>}
    </div>
  );
};

export default App;
