import { DNDItemsListProps } from '../../../types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const DNDItemsList = ({
  onDragEnd,
  items,
  formatItem,
  listCode,
}: DNDItemsListProps) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(droppableProvided) => (
          <div
            className="khb_DND-items"
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            {items
              ? items.map((item, index) => (
                  <Draggable
                    key={item.value}
                    draggableId={item.value}
                    index={index}
                  >
                    {(provided) => (
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
                          <p className="khb_DND-item-text">{item.label}</p>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))
              : null}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DNDItemsList;
