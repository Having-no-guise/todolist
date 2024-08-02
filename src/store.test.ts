import { act } from 'react';
import useStore from './store';
import { fetchTodos as fetchTodosApi, addTodo as addTodoApi, deleteTodo as deleteTodoApi, changeStatus as changeStatusApi, DataType } from './services/apiServices';


jest.mock('./services/apiServices');

describe('Todo Store', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('fetch todos and update state', async () => {
    // мок данные
    const mockTodos: DataType[] = [
      { key: '1', title: 'Todo 1', description: 'Description 1', status: 'not completed', isFavorite: false },
      { key: '2', title: 'Todo 2', description: 'Description 2', status: 'completed', isFavorite: false },
    ];


    (fetchTodosApi as jest.Mock).mockResolvedValue(mockTodos);


    await act(async () => {
      await useStore.getState().fetchTodos();
    });


    expect(useStore.getState().todos).toEqual(mockTodos);
    expect(useStore.getState().visibleTodos).toEqual(mockTodos.slice(0, 20));
  });


  it('add a new todo', async () => {

    const newTodo: DataType = { key: '3', title: 'Todo 3', description: 'Description 3', status: 'not completed', isFavorite: false };


    (addTodoApi as jest.Mock).mockResolvedValue(newTodo);


    await act(async () => {
      await useStore.getState().handleAdd(newTodo.title, newTodo.description, newTodo.status);
    });


    expect(useStore.getState().todos).toContainEqual(newTodo);
    expect(useStore.getState().visibleTodos).toContainEqual(newTodo);
  });


  it('delete a todo', async () => {

    const mockTodos: DataType[] = [{ key: '1', title: 'Todo 1', description: 'Description 1', status: 'not completed', isFavorite: false }];
    useStore.setState({ todos: mockTodos, visibleTodos: mockTodos });


    (deleteTodoApi as jest.Mock).mockResolvedValue(undefined);


    await act(async () => {
      await useStore.getState().handleDelete('1');
    });


    expect(useStore.getState().todos).toEqual([]);
    expect(useStore.getState().visibleTodos).toEqual([]);
  });


  it('change status of todo', async () => {

    const mockTodos: DataType[] = [{ key: '1', title: 'Todo 1', description: 'Description 1', status: 'not completed', isFavorite: false }];
    useStore.setState({ todos: mockTodos, visibleTodos: mockTodos });


    (changeStatusApi as jest.Mock).mockResolvedValue(undefined);


    await act(async () => {
      await useStore.getState().handleChangeStatus('1', 'Todo 1', 'Description 1', 'completed');
    });


    expect(useStore.getState().todos[0].status).toBe('completed');
    expect(useStore.getState().visibleTodos[0].status).toBe('completed');
  });
});
