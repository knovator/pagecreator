import React from 'react';
import Button from '../Button';
import Pencil from '../../../icons/pencil';
import Trash from '../../../icons/trash';
import { ObjectType, TableDataItemFormat, TableProps } from '../../../types';

const Table = ({ data, dataKeys, actions, loader, loading }: TableProps) => {
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
          <table className="khb_table">
            <thead className="khb_table-thead">
              <tr>
                {dataKeys.map((key, i) => (
                  <th scope="col" className="khb_table-heading" key={i}>
                    {key.label}
                  </th>
                ))}
                {actions && (actions?.edit || actions?.delete) && (
                  <th scope="col" className="khb_table-heading">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item: ObjectType, i: number) => (
                  <tr
                    className="khb_table-row"
                    key={item['id'] || item['_id'] || i}
                  >
                    {dataKeys.map((key, j) => cellItemRenderer(item, key, j))}
                    {actions && (
                      <td className="khb_table-row-actions">
                        {actions.edit && (
                          <Button size="xs" onClick={() => actions.edit!(item)}>
                            <Pencil />
                          </Button>
                        )}
                        {actions.delete && (
                          <Button
                            size="xs"
                            type="danger"
                            onClick={() => actions.delete!(item)}
                          >
                            <Trash />
                          </Button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
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
