export interface DataType {
    key: string;
    title: string;
    description: string;
    status: string;
    isFavorite: boolean;
}

const API_URL = 'https://cms.dev-land.host/api/tasks';


const getAuthHeaders = (token: string) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
});

export const fetchTodos = async (token: string): Promise<DataType[]> => {
    let allTodos: DataType[] = [];
    let page = 1;
    let totalPageCount = 1;

    do {
        const response = await fetch(`${API_URL}?pagination[page]=${page}`, {
            headers: getAuthHeaders(token),
        });
        
        if (!response.ok) {
            
            throw new Error('Failed to fetch data');
        }
        const result = await response.json();

        const todos = await result.data.map((item: any) => ({
            key: item.id.toString(),
            title: item.attributes.title,
            description: item.attributes.description,
            status: item.attributes.status,
        }));
        allTodos = allTodos.concat(todos);
        totalPageCount = result.meta.pagination.pageCount;
        page += 1;
    } while (page <= totalPageCount);

    return allTodos;
};
export const addTodo = async (title: string, description: string, status: string, token: string): Promise<DataType> => {

    const requestBody = {
        data: {
            title: title,
            description: description,
            status: status
        }
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
        throw new Error('Failed to add todo');
    }
    return response.json();
};

export const deleteTodo = async (token: string, id: string) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),

    });
    return response.status
}

export const changeStatus = async (id: string, title: string, description: string, status: string, token: string) => {
    const requestBody = {
        data: {
            title: title,
            description: description,
            status: status
        }
    };


    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(requestBody),
    });

    return response.status
} 
