import React, { FC } from 'react';
import { Radio, RadioChangeEvent } from "antd";
import useStore from '../store';
import styled from 'styled-components';


const FilterContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    margin-bottom: 10px;
`;

const MyFilter: FC = () => {
    const { filter, setFilter } = useStore();

    const onChange = (e: RadioChangeEvent) => {
        setFilter(e.target.value);
    };

    return (
        <FilterContainer>
            <div style={{ marginRight: "10px" }}>Filters</div>
            <Radio.Group onChange={onChange} value={filter}>
                <Radio value={1}>All</Radio>
                <Radio value={2}>Completed</Radio>
                <Radio value={3}>Not Completed</Radio>
                <Radio value={4}>Favorites</Radio>
            </Radio.Group>
        </FilterContainer>
    );
};

export default MyFilter;
