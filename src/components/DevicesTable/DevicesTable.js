import * as React from "react";
import Paper from "@material-ui/core/Paper";
import { EditingState } from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableBandHeader,
  TableHeaderRow,
  TableEditRow,
  TableEditColumn
} from "@devexpress/dx-react-grid-material-ui";

import { generateRows, defaultColumnValues } from "../demoData/devicesData";

const getRowId = row => row.id;

const getColor = value => {
  if (value < 24) {
    return "#00a152";
  }
  if (value < 50) {
    return "#ffeb3b";
  }
  if (value < 75) {
    return "#ff9800";
  }
  return "#ff3d00";
};

const HighlightedCell = ({ value, style }) => (
  <Table.Cell
    style={{
      backgroundColor: getColor(value),
      ...style
    }}
  >
    {value}
  </Table.Cell>
);

const Cell = props => {
  const { column } = props;
  if (
    column.name === "sensorValue" ||
    column.name === "sensorValueB" ||
    column.name === "sensorValueC"
  ) {
    return <HighlightedCell {...props} />;
  }
  return <Table.Cell {...props} />;
};

export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: "id", title: "ID" },
        { name: "deviceTitle", title: "TITLE" },
        { name: "deviceType", title: "TYPE" },
        { name: "location", title: "LOCATION" },
        { name: "sensorName", title: "TITLE" },
        { name: "sensorValue", title: "VALUE" },
        { name: "deviceStatus", title: "STATUS" },
        { name: "sensorNameB", title: "TITLE" },
        { name: "sensorValueB", title: "VALUE" },
        { name: "deviceStatusB", title: "STATUS" },
        { name: "sensorNameC", title: "TITLE" },
        { name: "sensorValueC", title: "VALUE" },
        { name: "deviceStatusC", title: "STATUS" }
      ],
      columnBands: [
        {
          title: "DEVICES",
          children: [
            { columnName: "id" },
            { columnName: "deviceTitle" },
            { columnName: "deviceType" },
            { columnName: "location" }
          ]
        },
        {
          title: "SENSORS",
          children: [
            {
              title: "Sensor-1",
              children: [
                { columnName: "deviceStatus" },
                { columnName: "sensorName" },
                { columnName: "sensorValue" }
              ]
            },
            {
              title: "Sensor-2",
              children: [
                { columnName: "deviceStatusB" },
                { columnName: "sensorNameB" },
                { columnName: "sensorValueB" }
              ]
            },
            {
              title: "Sensor-3",
              children: [
                { columnName: "sensorNameC" },
                { columnName: "sensorValueC" },
                { columnName: "deviceStatusC" }
              ]
            }
          ]
        }
      ],
      editingStateColumnExtensions: [
        { columnName: "id", editingEnabled: false }
      ],
      tableColumnExtensions: [
        { columnName: "id", width: 60 },
        { columnName: "sensorValue", width: 80 },
        { columnName: "sensorValueB", width: 80 },
        { columnName: "sensorValueC", width: 80 }
      ],
      rows: generateRows({
        columnValues: { id: ({ index }) => index, ...defaultColumnValues },
        length: 8
      }),

      editingRowIds: [],
      addedRows: [],
      rowChanges: {}
    };

    this.changeAddedRows = this.changeAddedRows.bind(this);
    this.changeEditingRowIds = this.changeEditingRowIds.bind(this);
    this.changeRowChanges = this.changeRowChanges.bind(this);
    this.commitChanges = this.commitChanges.bind(this);
  }

  changeAddedRows(addedRows) {
    const initialized = addedRows.map(row =>
      Object.keys(row).length ? row : { city: "" }
    );
    this.setState({ addedRows: initialized });
  }

  changeEditingRowIds(editingRowIds) {
    this.setState({ editingRowIds });
  }

  changeRowChanges(rowChanges) {
    this.setState({ rowChanges });
  }

  commitChanges({ added, changed, deleted }) {
    let { rows } = this.state;
    if (added) {
      const startingAddedId =
        rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
      rows = [
        ...rows,
        ...added.map((row, index) => ({
          id: startingAddedId + index,
          ...row
        }))
      ];
    }
    if (changed) {
      rows = rows.map(row =>
        changed[row.id] ? { ...row, ...changed[row.id] } : row
      );
    }
    if (deleted) {
      const deletedSet = new Set(deleted);
      rows = rows.filter(row => !deletedSet.has(row.id));
    }
    this.setState({ rows });
  }

  render() {
    const {
      rows,
      columns,
      tableColumnExtensions,
      editingStateColumnExtensions,
      editingRowIds,
      columnBands,
      rowChanges,
      addedRows
    } = this.state;

    return (
      <Paper>
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <EditingState
            editingRowIds={editingRowIds}
            onEditingRowIdsChange={this.changeEditingRowIds}
            rowChanges={rowChanges}
            onRowChangesChange={this.changeRowChanges}
            addedRows={addedRows}
            onAddedRowsChange={this.changeAddedRows}
            onCommitChanges={this.commitChanges}
            columnExtensions={editingStateColumnExtensions}
          />
          <Table
            columnExtensions={tableColumnExtensions}
            cellComponent={Cell}
          />
          <TableHeaderRow />
          <TableEditRow />
          <TableEditColumn
            showAddCommand={!addedRows.length}
            showEditCommand
            showDeleteCommand
          />
          <TableBandHeader columnBands={columnBands} />
        </Grid>
      </Paper>
    );
  }
}
