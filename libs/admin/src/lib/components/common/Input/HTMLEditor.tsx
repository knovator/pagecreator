import React from 'react';
import classNames from 'classnames';
import SunEditor from 'suneditor-react';
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
      <SunEditor
        setContents={value}
        onChange={onChange}
        setOptions={{
          defaultStyle:
            'font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; font-size: 0.875rem;',
          buttonList: [
            ['undo', 'redo', 'align'],
            [
              'bold',
              'underline',
              'italic',
              'strike',
              'subscript',
              'superscript',
            ],
            ['fontColor', 'hiliteColor'],
            ['removeFormat'],
          ],
        }}
      />
      {error && <p className="khb_input-error ">{error}</p>}
    </div>
  );
};

export default App;
