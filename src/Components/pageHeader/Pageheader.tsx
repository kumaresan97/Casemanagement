// import * as React from 'react';
// import { Button } from 'antd';
// import { ReloadOutlined, FilterOutlined } from '@ant-design/icons';
// import styles from './Pageheader.module.scss';
// import SearchInput from '../Formfields/Searchfield/CustomSearch';

// interface PageHeaderProps {
//     title: string;
//     showFilter?: boolean;
//     showSearch?: boolean;
//     showRefresh?: boolean;
//     buttonTitle?: string;
//     buttonIcon?: React.ReactNode;
//     onFilter?: () => void;
//     onSearch?: (value: string) => void;
//     onRefresh?: () => void;
//     onButtonClick?: () => void;
//     searchPlaceholder?: string;
// }




// const PageHeader: React.FC<PageHeaderProps> = ({
//     title,
//     showFilter,
//     showSearch,
//     showRefresh,
//     buttonTitle,
//     buttonIcon,
//     onFilter,
//     onSearch,
//     onRefresh,
//     onButtonClick,
//     searchPlaceholder
// }) => {
//     const [searchText, setSearchText] = React.useState('');

//     return (
//         <div className={styles.pageHeader}>
//             <h2 className={styles.title}>{title}</h2>
//             <div className={styles.actions}>
//                 {showFilter && (
//                     <Button
//                         type="primary"
//                         icon={<FilterOutlined />}
//                         onClick={onFilter}
//                         className={styles.btn}
//                     >
//                         Filter
//                     </Button>
//                 )}

//                 {showSearch && (
//                     <SearchInput
//                         value={searchText}
//                         onSearch={(val) => onSearch?.(val)}

//                         onChange={(val) => {
//                             setSearchText(val);       // update local search text
//                             onSearch?.(val);          // call parent onSearch
//                         }} placeholder={searchPlaceholder}
//                         width={200}

//                     />
//                 )}

//                 {showRefresh && (
//                     <Button
//                         type="text"
//                         icon={<ReloadOutlined />}
//                         onClick={onRefresh}
//                         className={styles.iconBtn}
//                     />
//                 )}

//                 {buttonTitle && (
//                     <Button
//                         type="primary"
//                         icon={buttonIcon}
//                         onClick={onButtonClick}
//                         className={styles.btn}
//                     >
//                         {buttonTitle}
//                     </Button>
//                 )}
//             </div>
//         </div>
//     );
// };
// export default PageHeader;



import * as React from 'react';
import { Button, } from 'antd';
import { ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import styles from './Pageheader.module.scss';
import SearchInput from '../Formfields/Searchfield/CustomSearch';
import SelectField from '../Formfields/Dropdown/CustomDropdown';
import DatePickerField from '../Formfields/Calendar/CustomCalendar';

// const { Option } = Select;

interface PageHeaderProps {
    title: string;
    showFilter?: boolean;
    showSearch?: boolean;
    showRefresh?: boolean;


    searchText?: any,
    buttonTitle?: string;
    buttonIcon?: React.ReactNode;
    onFilter?: () => void;
    onSearch?: (value: string) => void;
    onRefresh?: () => void;
    onButtonClick?: () => void;
    searchPlaceholder?: string;

    // New props
    isDropdown?: boolean;
    dropdownOptions?: { label: string; value: string }[];
    dropdownPlaceholder?: string;
    onDropdownChange?: (value: string) => void;
    dropdownValue?: string | any;
    calendarValue?: string | moment.Moment | any;


    showCalendar?: boolean;
    calendarPlaceholder?: string;
    onDateChange?: (dateString: string) => void;
}
const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    showFilter,
    showSearch,
    showRefresh,
    buttonTitle,
    buttonIcon,
    searchText,
    onFilter,
    onSearch,
    onRefresh,
    onButtonClick,
    searchPlaceholder,
    isDropdown,
    dropdownValue,
    calendarValue,
    dropdownOptions = [],
    dropdownPlaceholder,
    onDropdownChange,
    showCalendar,
    calendarPlaceholder,
    onDateChange
}) => {
    // const [searchText, setSearchText] = React.useState('');

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

                {isDropdown && (
                    // <Select
                    //     placeholder={dropdownPlaceholder || "Select option"}
                    //     onChange={onDropdownChange}
                    //     style={{ width: 150, marginRight: 10 }}
                    // >
                    //     {dropdownOptions.map(opt => (
                    //         <Option key={opt.value} value={opt.value}>
                    //             {opt.label}
                    //         </Option>
                    //     ))}
                    // </Select>


                    <SelectField placeholder={dropdownPlaceholder || "Select option"} onChange={onDropdownChange} value={dropdownValue} />
                )}

                {showCalendar && (


                    <DatePickerField placeholder={calendarPlaceholder || "Select date"}
                        onChange={onDateChange}
                        value={calendarValue}
                        isheight={false}

                    />
                    // <DatePicker
                    //     placeholder={calendarPlaceholder || "Select date"}
                    //     style={{ width: 160, marginRight: 10 }}
                    //     onChange={(date, dateString) => onDateChange?.(dateString)}
                    //     format="DD/MM/YYYY"
                    // />
                )}

                {showSearch && (
                    <SearchInput
                        value={searchText}
                        onSearch={(val) => onSearch?.(val)}
                        onChange={(val) => {
                            // setSearchText(val);
                            onSearch?.(val);
                        }}
                        placeholder={searchPlaceholder}
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
