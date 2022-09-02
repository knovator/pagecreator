import React, { useRef } from 'react';
import CSSTransition from 'react-transition-group/CSSTransition';
import CloseIcon from '../../../icons/close';

interface DrawerProps extends React.PropsWithChildren {
  open: boolean;
  onClose: () => void;
  title?: string;
  footerContent?: React.ReactNode;
}

const Drawer = ({
  children,
  open,
  onClose,
  title,
  footerContent,
}: DrawerProps) => {
  const nodeRef = useRef(null);
  return (
    <CSSTransition
      ref={nodeRef}
      in={open}
      timeout={{ enter: 250, exit: 350 }}
      classNames="khb_drawer"
      mountOnEnter
      unmountOnExit
    >
      <div
        className="khb_drawer-wrapper-1"
        aria-labelledby="modal"
        role="dialog"
        aria-modal="true"
        ref={nodeRef}
        data-testid="drawer"
      >
        <div className="khb_drawer-wrapper-2">
          <div
            className="khb_drawer-backdrop"
            role="button"
            onClick={onClose}
            onKeyDown={onClose}
            tabIndex={0}
          />
          <div className="khb_drawer-container-1">
            <div className="khb_drawer-container-2">
              <div className="khb_drawer-close-section">
                <button
                  type="button"
                  className="khb_drawer-close-btn"
                  onClick={onClose}
                  data-testid="drawer-close"
                >
                  <span className="khb_sr-only">Close panel</span>
                  <CloseIcon />
                </button>
              </div>
              <div className="khb_drawer-main">
                <div className="khb_drawer-header">
                  <p className="khb_drawer-header-title">{title}</p>
                </div>
                <div className="relative flex-1 px-6 py-6 overflow-auto">
                  {/* Replace with your content */}
                  {children}
                  {/* /End replace */}
                </div>
                {footerContent && (
                  <div className="khb_drawer-footer">{footerContent}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default Drawer;
