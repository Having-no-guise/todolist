import React, { FC, useEffect } from 'react';
import { Select, Space, Table, Button, message } from 'antd';
import { PlusOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import AddModal from '../modals/addModal';
import useStore from '../store';
import styled from 'styled-components';
import { error } from 'console';

const Container = styled.div`
    margin-left: 10%;
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: center;
    padding: 20px;
`;

const Wrapper = styled.div`
    width: 80%;
    height: 600px;
    overflow: auto;
`;

const MyTODOList: FC<{ token: string }> = ({ token }) => {
    const {
        todos,
        visibleTodos,
        loading,
        filter,
        addModalOpen,
        favorites,
        setToken,
        setAddModalOpen,

        fetchTodos,
        fetchMoreTodos,
        handleChangeStatus,
        handleDelete,
        handleAdd,
        toggleFavorite,
        setVisibleTodos
    } = useStore(state => ({
        ...state,
        setToken: state.setToken,
        setAddModalOpen: state.setAddModalOpen,
        setPage: state.setPage,
        setVisibleTodos: state.setVisibleTodos,
        fetchTodos: state.fetchTodos,
        fetchMoreTodos: state.fetchMoreTodos,
        handleChangeStatus: state.handleChangeStatus,
        handleDelete: state.handleDelete,
        handleAdd: state.handleAdd,
        setFilter: state.setFilter,
        filter: state.filter,
        favorites: state.favorites,
        toggleFavorite: state.toggleFavorite
    }));

    useEffect(() => {
        setToken(token);
        fetchTodos();
    }, [token]);

    useEffect(() => {
        const filteredTodos = useStore.getState().applyFilter(todos, filter);
        setVisibleTodos(filteredTodos.slice(0, useStore.getState().page * 20));
    }, [filter, todos]);

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_: any, record: { key: string, title: string, description: string, status: string }) => (
                <Select value={record.status} onChange={(e) => handleChangeStatus(record.key, record.title, record.description, e)} options={[
                    { value: 'not completed', label: 'Not completed' },
                    { value: 'completed', label: 'Completed' }
                ]} />
            )
        },
        {
            title: 'Favorite',
            key: 'favorite',
            render: (_: any, record: { key: string, title: string, description: string, status: string }) => (
                <Button
                    type="primary"
                    style={{ backgroundColor: "White" }}
                    icon={favorites.includes(record.key) ? <StarFilled style={{ color: "Black" }} /> : <StarOutlined style={{ color: "Black" }} />}
                    onClick={() => handleFavoriteClick(record.key)}
                />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: { key: string, title: string, description: string, status: string }) => (
                <Space size="middle">
                    <a onClick={() => handleDelete(record.key)}>Delete</a>
                </Space>
            ),
        }
    ];

    const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
            if (visibleTodos.length < todos.length) {
                fetchMoreTodos();
            } else {
                message.info('Больше задач нет');
            }
        }
    };

    const handleAddButtonClick = () => {
        setAddModalOpen(true);
    };

    const closeModal = () => {
        setAddModalOpen(false);
    };

    const onOk = async (values: { title: string, description: string, status: string }) => {
        if (values.title && values.description && values.status) {
            await handleAdd(values.title, values.description, values.status);
            await fetchTodos();
            closeModal();
        } else {
            message.info('Заполните все поля');
        }
    };

    const handleFavoriteClick = (key: string) => {
        toggleFavorite(key);
        fetchTodos();
    }

    return (
        <Container>

            <div>
                <Button type="primary" style={{ marginBottom: '10px' }} onClick={handleAddButtonClick} icon={<PlusOutlined />}>Add Task</Button>
                <AddModal addModalOpen={addModalOpen} onClose={closeModal} onOk={onOk} />
                <Wrapper onScroll={handleScroll}>
                    <Table dataSource={visibleTodos} columns={columns} pagination={false} loading={loading} rowKey={(element) => element.key} />
                </Wrapper>
            </div>
        </Container>
    );
};

export default MyTODOList;
