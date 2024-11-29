import { FreeOperationComponent } from './free-operation.component';

describe('FreeOperationComponent', () => {
  let component: FreeOperationComponent;

  beforeEach(() => {
    component = new FreeOperationComponent();
  });

  it('should initialize with default values', () => {
    expect(component.data).toBeNull();
    expect(component.filteredData).toEqual([]);
    expect(component.searchQuery).toBe('');
    expect(component.editableCell).toBeNull();
    expect(component.hoveredRowIndex).toBeNull();
    expect(component.isEditTable).toBe(false);
  });

  it('should handle file upload correctly', () => {
    const mockData = {
      data: [
        ['row1col1', 'row1col2'],
        ['row2col1', 'row2col2'],
      ],
      fileName: 'test.csv',
      fileSize: 12345,
    };

    component.handleFileUpload(mockData);

    expect(component.data).toEqual(mockData);
    expect(component.filteredData).toEqual(mockData.data);
    expect(component.fileName).toBe('test.csv');
    expect(component.fileSize).toBe(12345);
  });

  it('should filter table based on search query', () => {
    const mockData = {
      data: [
        ['apple', 'banana'],
        ['cherry', 'date'],
        ['eggfruit', 'fig'],
      ],
      fileName: 'test.csv',
      fileSize: 12345,
    };

    component.handleFileUpload(mockData);

    component.searchQuery = 'cherry';
    component.filterTable();
    expect(component.filteredData).toEqual([['cherry', 'date']]);

    component.searchQuery = '';
    component.filterTable();
    expect(component.filteredData).toEqual(mockData.data);

    component.searchQuery = 'notfound';
    component.filterTable();
    expect(component.filteredData).toEqual([]);
  });

  it('should enable table editing mode', () => {
    expect(component.isEditTable).toBe(false);
    component.editTable();
    expect(component.isEditTable).toBe(true);
  });

  it('should set editable cell', () => {
    expect(component.editableCell).toBeNull();
    component.editCell(1, 1);
    expect(component.editableCell).toEqual({ row: 1, col: 1 });
  });

  it('should save cell and clear editableCell', () => {
    component.editCell(1, 1);
    expect(component.editableCell).toEqual({ row: 1, col: 1 });
    component.saveCell();
    expect(component.editableCell).toBeNull();
  });

  it('should delete a row and update filtered data', () => {
    const mockData = {
      data: [
        ['row1col1', 'row1col2'],
        ['row2col1', 'row2col2'],
        ['row3col1', 'row3col2'],
      ],
      fileName: 'test.csv',
      fileSize: 12345,
    };

    component.handleFileUpload(mockData);

    component.deleteRow(1);
    expect(component.data?.data).toEqual([
      ['row1col1', 'row1col2'],
      ['row3col1', 'row3col2'],
    ]);
    expect(component.filteredData).toEqual([
      ['row1col1', 'row1col2'],
      ['row3col1', 'row3col2'],
    ]);
  });
});
