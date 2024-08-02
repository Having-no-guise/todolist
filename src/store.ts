import { create } from 'zustand';
import { fetchTodos, addTodo, deleteTodo, changeStatus, DataType } from './services/apiServices';

interface TodoStore {
  todos: DataType[];
  visibleTodos: DataType[];
  loading: boolean;
  page: number;
  token: string;
  addModalOpen: boolean;
  filter: number;
  favorites: string[];

  setTodos: (todos: DataType[]) => void;
  setVisibleTodos: (visibleTodos: DataType[]) => void;
  setLoading: (loading: boolean) => void;
  setPage: (page: number) => void;
  setToken: (token: string) => void;
  setAddModalOpen: (open: boolean) => void;
  setFilter: (filter: number) => void;

  fetchTodos: () => Promise<void>;
  fetchMoreTodos: () => void;
  handleChangeStatus: (id: string, title: string, description: string, status: string) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleAdd: (title: string, description: string, status: string) => Promise<void>;
  applyFilter: (todos: DataType[], filter: number) => DataType[];
  toggleFavorite: (key: string) => void;
}

const useStore = create<TodoStore>((set, get) => ({
  todos: [],
  visibleTodos: [],
  loading: false,
  page: 1,
  token: '',
  addModalOpen: false,
  filter: 1,
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),

  setTodos: (todos) => set({ todos }),
  setVisibleTodos: (visibleTodos) => set({ visibleTodos }),
  setLoading: (loading) => set({ loading }),
  setPage: (page) => set({ page }),
  setToken: (token) => set({ token }),
  setAddModalOpen: (open) => set({ addModalOpen: open }),
  setFilter: (filter) => set({ filter }),

  toggleFavorite: (key) => {
    const { favorites } = get();
    const updatedFavorites = favorites.includes(key) ? favorites.filter(fav => fav !== key) : [...favorites, key];
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    set({ favorites: updatedFavorites });
  },

  fetchTodos: async () => {
    set({ loading: true });
    try {
      const token = get().token;
      
      const fetchedTodos = await fetchTodos(token);
      
      set({ todos: fetchedTodos, visibleTodos: fetchedTodos.slice(0, 20) });
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchMoreTodos: () => {
    const { page, todos, setVisibleTodos, setPage, setLoading } = get();
    if (get().loading) return;

    setLoading(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const newTodos = todos.slice(0, nextPage * 20);
      setVisibleTodos(newTodos);
      setPage(nextPage);
      setLoading(false);
    }, 300);
  },

  handleChangeStatus: async (id, title, description, status) => {
    const token = get().token;
    await changeStatus(id, title, description, status, token);
    const updatedTodos = get().todos.map(todo =>
      todo.key === id ? { ...todo, status } : todo
    );
    set({ todos: updatedTodos, visibleTodos: updatedTodos.slice(0, get().page * 20) });
  },

  handleDelete: async (id) => {
    const token = get().token;
    await deleteTodo(token, id);
    const updatedTodos = get().todos.filter(todo => todo.key !== id);
    set({ todos: updatedTodos, visibleTodos: updatedTodos.slice(0, get().page * 20) });
  },

  handleAdd: async (title, description, status) => {
    const { token } = get();
    const newTodo = await addTodo(title, description, status, token);
    const updatedTodos = [newTodo, ...get().todos];
    set({ todos: updatedTodos, visibleTodos: updatedTodos.slice(0, get().page * 20) });
  },
  applyFilter: (todos, filter) => {
    switch (filter) {
      case 2:
        return todos.filter(todo => todo.status === 'completed');
      case 3:
        return todos.filter(todo => todo.status === 'not completed');
      case 4:
        return todos.filter(todo => get().favorites.includes(todo.key));
      case 1: // All
      default:
        return todos;
    }
  }

}));

export default useStore;
