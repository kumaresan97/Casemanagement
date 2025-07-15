import * as React from 'react';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import styles from "./PeoplePicker.module.scss";

interface PeoplePickerFieldProps {
    label?: string;
    context: any;
    defaultUsers?: string[];
    onChange?: (selectedUsers: any[]) => void;
    multiple?: boolean;
    disabled?: boolean;
    error?: string | any,
    required?: boolean
}

const PeoplePickerField: React.FC<PeoplePickerFieldProps> = ({
    label,
    context,
    defaultUsers = [],
    onChange,
    multiple,
    required,
    error,
    disabled = false
}) => {



    const handlePeopleChange = (items: any[]) => {
        const mappedUsers = items.map(item => ({
            id: item.id,
            email: item.secondaryText,
            name: item.text
        }));

        onChange?.(mappedUsers);
    };
    return (
        <div className={styles.wrapper}>
            {label && <label className="label">
                {label} {required && <span className="required-star">*</span>}
            </label>
            }            <div className={styles.peoplePicker}>
                {/* <div > */}
                <PeoplePicker
                    context={context}
                    showtooltip={false}
                    webAbsoluteUrl={context.pageContext.web.absoluteUrl}

                    titleText=""
                    personSelectionLimit={multiple ? 10 : 1}
                    groupName={""}
                    // errorMessage={error ?? ""}
                    // isRequired={false}
                    disabled={disabled}
                    ensureUser={true}
                    styles={{
                        root: {
                            minWidth: "100%",
                            maxWidth: "100%",
                        },
                        // text: {
                        //     border: "0 !important",
                        //     outline: "0 !important",
                        // },
                    }}
                    onChange={handlePeopleChange}


                    // onChange={onChange}
                    defaultSelectedUsers={defaultUsers}
                    principalTypes={[PrincipalType.User]}
                    resolveDelay={300}
                />
            </div>
            {error && <div className="error-message">{error}</div>}

        </div>
    );
};

export default PeoplePickerField;
