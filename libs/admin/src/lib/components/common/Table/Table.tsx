import React from 'react';
import Pencil from '../../../icons/pencil';
import Trash from '../../../icons/trash';
import { ObjectType, TableDataItemFormat, TableProps } from '../../../types';

const Table = ({
  data,
  dataKeys,
  actions,
  loader,
  loading,
  extraActions,
  actionsLabel,
  extraColumns,
}: TableProps) => {
  const cellItemRenderer = (
    item: ObjectType,
    dataKey: TableDataItemFormat,
    index: number
  ) => {
    if (dataKey.highlight)
      return (
        <th scope="row" className="khb_table-row-heading" key={index}>
          {item[dataKey.dataKey]}
        </th>
      );
    else if (dataKey.Cell)
      return (
        <td className="khb_table-row-data" key={index}>
          {dataKey.Cell({ row: item })}
        </td>
      );
    else
      return (
        <td className="khb_table-row-data" key={index}>
          {item[dataKey.dataKey]}
        </td>
      );
  };
  return (
    <div className={`khb_table-container`} data-testid="table">
      <div className={`khb_table-height`}>
        {loading && loader ? (
          <div className="khb_table-height">{loader}</div>
        ) : (
          <table
            className={`khb_table ${data.length > 0 ? '' : 'empty-table'}`}
          >
            <thead className="khb_thead">
              <tr>
                {dataKeys.map((key, i) => (
                  <th scope="col" className="khb_table-heading" key={i}>
                    {key.label}
                  </th>
                ))}
                {Array.isArray(extraColumns)
                  ? extraColumns.map((action) => (
                      <th scope="col" className="khb_table-heading">
                        {action.label}
                      </th>
                    ))
                  : null}
                {(actions && (actions?.edit || actions?.delete)) ||
                typeof extraActions === 'function' ? (
                  <th scope="col" className="khb_table-heading">
                    {actionsLabel}
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody className="khb_tbody">
              {data.length > 0 ? (
                data.map((item: ObjectType, i: number) => (
                  <tr
                    className="khb_table-row"
                    key={item['id'] || item['_id'] || i}
                  >
                    {dataKeys.map((key, j) => cellItemRenderer(item, key, j))}
                    {Array.isArray(extraColumns)
                      ? extraColumns.map((column) => (
                          <td className="khb_table-row-data" key={i}>
                            {column.Cell(item)}
                          </td>
                        ))
                      : null}
                    {(actions && (actions?.edit || actions?.delete)) ||
                    typeof extraActions === 'function' ? (
                      <td className="khb_table-row-actions">
                        {actions &&
                        actions.edit &&
                        typeof actions.edit === 'function' ? (
                          <button
                            className="khb_actions-update"
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            onClick={() => actions.edit(item)}
                          >
                            <Pencil />
                          </button>
                        ) : null}
                        {actions &&
                          actions.delete &&
                          typeof actions.delete === 'function' &&  !!item['canDel'] !== false &&  (
                            <button
                              className="khb_actions-delete"
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore
                              onClick={() => actions.delete!(item)}
                            >
                              <Trash />
                            </button>
                          )}
                        {typeof extraActions === 'function'
                          ? extraActions(item)
                          : null}
                      </td>
                    ) : null}
                  </tr>
                ))
              ) : (
                <tr className="empty-row">
                  <td colSpan={(dataKeys?.length || 0) + 1}>No data found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Table;
