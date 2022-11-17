// 自定义指令，可以操作原生dom
// 当组件内部有复杂的视图操作，可以将逻辑解耦到自定义指令中

let isMouseOver = false;

const vTableSelect = {
  mounted(el, bindings) {
    vTableSelect.el = el;
    bindEvent(bindings.value);
  },
};

function bindEvent(state) {
  const { el } = vTableSelect;

  el.addEventListener('click', handleTDClick.bind(el, state), false);
  el.addEventListener('dblclick', handleTDDblClick.bind(el, state), false);
  el.addEventListener('mousedown', handleTDMouseDown.bind(el, state), false);
  window.addEventListener('click', handleWindowClick.bind(el, state), false);
}

// EventHandlers
function handleTDClick(...[state, e]) {
  console.log('handleTDClick');
  if (!isMouseOver) {
    const { target } = e;
    e.stopPropagation();

    restoreSelectedData(state);

    if (target.tagName.toLowerCase() === 'td') {
      const { row, column } = getRowAndColumn(target);
      const selectedData = getTargetData(state.tableData, row, column);
      console.log('selectedData1', selectedData);

      state.selectedData = selectedData;
      state.selectedData.selected = true;
    }
  }
}

function handleTDDblClick(...[state, e]) {
  console.log('handleTDDblClick');
  const { target } = e;
  e.stopPropagation();

  restoreSelectedData(state);

  if (target.tagName.toLowerCase() === 'td') {
    const { row, column } = getRowAndColumn(target);
    state.selectedData = getTargetData(state.tableData, row, column);
    this.vInput = createInput(target, state.tableData, row, column);
  }
}

function handleTDMouseDown(...[state, e]) {
  const { target } = e;
  e.stopPropagation();

  isMouseOver = false;

  restoreSelectedData(state);

  const _handleTDMouseOver = handleTDMouseOver.bind(this, state);

  document.addEventListener('mouseover', _handleTDMouseOver, false);
  document.addEventListener('mouseup', handleTDMouseUp, false);

  if (target.tagName.toLowerCase() === 'td') {
    const { row, column } = getRowAndColumn(target);
    // 记录鼠标移动开始的row,column
    this.startRow = row;
    this.startColumn = column;
  }

  function handleTDMouseUp() {
    document.removeEventListener('mouseover', _handleTDMouseOver, false);
    document.removeEventListener('mouseup', handleTDMouseUp, false);
    // mouseOver会触发mousedown,mouseup,window.click这三个事件
    // 这三个是同步执行，然后再次点击table外时要触发清空操作
    // 也就是总共会触发两次window.click，需要在第一次window.click之后将isMouseOver设置为false
    // 放入下一个事件循环
    setTimeout(() => (isMouseOver = false));
  }
}

function handleTDMouseOver(...[state, e]) {
  const { target } = e;
  e.stopPropagation();

  isMouseOver = true;

  if (target.tagName.toLowerCase() === 'td') {
    const { row, column } = getRowAndColumn(target);
    // 记录鼠标移动结束的row,column
    this.endRow = row;
    this.endColumn = column;
    state.selectedAreaData = getSelectedAreaData(
      state.tableData,
      this.startRow,
      this.startColumn,
      this.endRow,
      this.endColumn
    );
  }
  console.log(state.selectedAreaData);
}

function handleWindowClick(state) {
  console.log('handleWindowClick');
  this.vInput && (state.selectedData.content = this.vInput.value);
  !isMouseOver && restoreSelectedData(state);
}

// Functions
function restoreSelectedData(state) {
  const { el } = vTableSelect;

  if (state.selectedData) {
    state.selectedData.selected = false;
  }
  if (state.selectedAreaData.length) {
    state.selectedAreaData.forEach((data) => {
      data.selected = false;
    });
    state.selectedAreaData = [];
  }
  if (el.vInput) {
    el.vInput.remove();
    el.vInput = null;
  }
}

function createInput(target, data, row, column) {
  const { content } = getTargetData(data, row, column);
  console.log('content', content);
  const vInput = document.createElement('input');
  vInput.type = 'text';
  vInput.value = content;
  vInput.onfocus = vInput.select;
  target.appendChild(vInput);
  vInput.focus();
  vInput.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
  `;
  vInput.addEventListener(
    'keypress',
    function (e) {
      if (e.key === 'Enter') {
        console.log('Enter', e.target.value);
        vInput.blur();
        vInput.value = e.target.value;
      }
    },
    false
  );

  return vInput;
}

// Utils
function getRowAndColumn(target) {
  const { dataset } = target;

  return {
    row: Number(dataset.row),
    column: Number(dataset.column),
  };
}

function getTargetData(data, row, column) {
  let target = null;
  data.forEach((_row, _rowIndex) => {
    if (row === _rowIndex) {
      _row.data.forEach((_column, _columnIndex) => {
        if (column === _columnIndex) {
          target = _column;
        }
      });
    }
  });
  return target;
}

function getSelectedAreaData(data, startRow, startColumn, endRow, endColumn) {
  const selectedAreaData = [];
  if (startRow <= endRow) {
    // 从上到下
    for (let i = startRow; i <= endRow; i++) {
      setSelectedAreaData(data[i].data, startColumn, endColumn);
    }
  } else {
    // 从下到上
    for (let i = startRow; i >= endRow; i--) {
      setSelectedAreaData(data[i].data, startColumn, endColumn);
    }
  }
  function setSelectedAreaData(rowData, startColumn, endColumn) {
    if (startColumn <= endColumn) {
      for (let j = startColumn; j <= endColumn; j++) {
        pushColumnData(rowData[j]);
      }
    } else {
      for (let j = startColumn; j >= endColumn; j--) {
        pushColumnData(rowData[j]);
      }
    }

    function pushColumnData(columnData) {
      columnData.selected = true;
      selectedAreaData.push(columnData);
    }
  }
  return selectedAreaData;
}

export default vTableSelect;
