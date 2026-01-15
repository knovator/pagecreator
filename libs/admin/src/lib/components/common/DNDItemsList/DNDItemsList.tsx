import React from 'react';
import { DNDItemsListProps } from '../../../types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Settings from '../../../icons/settings';

const DragDropContextWrapper =
  DragDropContext as unknown as React.ComponentType<any>;
const DroppableWrapper: any = Droppable;
const DraggableWrapper: any = Draggable;

const DNDItemsList = ({
  onDragEnd,
  items,
  formatItem,
  listCode,
  onFilterClick,
}: DNDItemsListProps) => {
  return (
    <DragDropContextWrapper onDragEnd={onDragEnd}>
      <DroppableWrapper droppableId="droppable">
        {(droppableProvided: any) => (
          <div
            className="khb_DND-items"
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            {items
              ? items.map((item, index) => (
                  <DraggableWrapper
                    key={item.value}
                    draggableId={item.value}
                    index={index}
                  >
                    {(provided: any) => (
                      <div
                        className="khb_DND-item"
                        key={item.value}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {typeof formatItem === 'function' && listCode ? (
                          formatItem(listCode, item)
                        ) : (
                          <div className="khb_DND-item-content">
                            <p className="khb_DND-item-text">{item.label}</p>
                            {((item as { code?: string }).code ===
                              'BROWSE_JOBS' ||
                              item.value === 'BROWSE_JOBS') && (
                              <button
                                type="button"
                                className="khb_DND-item-settings"
                                onClick={onFilterClick}
                                aria-label="Open filter settings"
                              >
                                <Settings className="khb_DND-item-settings-icon" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </DraggableWrapper>
                ))
              : null}
            {droppableProvided.placeholder}
          </div>
        )}
      </DroppableWrapper>
    </DragDropContextWrapper>
  );
};

export default DNDItemsList;
