import * as React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './Search.module.scss';

interface SearchInputProps {
    value?: string;
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
    placeholder?: string;
    width?: number | string;
    className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
    value = '',
    onChange,
    onSearch,
    placeholder = 'Search...',
    width,
    className,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        onChange?.(val);     // For local state (if controlled)
        onSearch?.(val.trim()); // Trigger search immediately
    };

    return (
        <Input
            className={`${styles.search} ${className ?? ''}`}
            prefix={<SearchOutlined />}
            placeholder={placeholder}
            allowClear
            style={{ width }}
            value={value}
            onChange={handleChange}
        />
    );
};

export default SearchInput;
