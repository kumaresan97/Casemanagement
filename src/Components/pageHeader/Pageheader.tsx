import * as React from 'react';
import { Button } from 'antd';
import { ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import styles from './Pageheader.module.scss';
import SearchInput from '../Formfields/Searchfield/CustomSearch';

interface PageHeaderProps {
    title: string;
    showFilter?: boolean;
    showSearch?: boolean;
    showRefresh?: boolean;
    buttonTitle?: string;
    buttonIcon?: React.ReactNode;
    onFilter?: () => void;
    onSearch?: (value: string) => void;
    onRefresh?: () => void;
    onButtonClick?: () => void;
}




const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    showFilter,
    showSearch,
    showRefresh,
    buttonTitle,
    buttonIcon,
    onFilter,
    onSearch,
    onRefresh,
    onButtonClick,
}) => {
    const [searchText, setSearchText] = React.useState('');

    return (
        <div className={styles.pageHeader}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.actions}>
                {showFilter && (
                    <Button
                        type="primary"
                        icon={<FilterOutlined />}
                        onClick={onFilter}
                        className={styles.btn}
                    >
                        Filter
                    </Button>
                )}

                {showSearch && (
                    <SearchInput
                        value={searchText}
                        onSearch={(val) => onSearch?.(val)}

                        onChange={(val) => {
                            setSearchText(val);       // update local search text
                            onSearch?.(val);          // call parent onSearch
                        }} placeholder="Search cases..."
                        width={200}

                    />
                )}

                {showRefresh && (
                    <Button
                        type="text"
                        icon={<ReloadOutlined />}
                        onClick={onRefresh}
                        className={styles.iconBtn}
                    />
                )}

                {buttonTitle && (
                    <Button
                        type="primary"
                        icon={buttonIcon}
                        onClick={onButtonClick}
                        className={styles.btn}
                    >
                        {buttonTitle}
                    </Button>
                )}
            </div>
        </div>
    );
};
export default PageHeader;

