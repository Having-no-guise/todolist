import { Modal, Input, Space, Select } from "antd";
import React, { FC, useState } from 'react';

interface ModalType {
    addModalOpen: boolean
    onClose: () => void
    onOk: (values: { title: string; description: string; status: string }) => void;
}

const options = [
    {
        value: "not Complete",
        label: "Not Complete"
    },
    {
        value: "complete",
        label: "Complete"
    },
]

const AddModal: FC<ModalType> = ({ addModalOpen, onClose, onOk }) => {

    const [title, setTitle] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [status, setStatus] = useState<string>();


    const handleOk = () => {
        if (title && description && status) {

            onOk({ title, description, status });
        }
        resetFields();

        onClose();
    }

    const handleCancel = () => {
        resetFields();
        onClose();
    };

    const resetFields = () => {
        setTitle("Title");
        setDescription("Description");
        setStatus("Status");
    }

    return (
        <Modal
            title='Add Task'
            centered
            open={addModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Space.Compact>
                <Input value={title} onChange={e => setTitle(e.target.value)} allowClear />
                <Input value={description} onChange={e => setDescription(e.target.value)} allowClear />
                <Select value={status} onChange={e => setStatus(e)} options={options} />
            </Space.Compact>
        </Modal>
    )
}

export default AddModal;