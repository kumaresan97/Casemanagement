import * as React from 'react';
import CommonTabLayout from '../../Components/TabLayout/Customlayout';

const CaseDetails: React.FC = () => {
    const tabItems = [
        { key: 'case-info', label: 'Case Info' },
        { key: 'eligibility', label: 'Eligibility' },
        { key: 'documents', label: 'Documents (ROI)' },
        { key: 'diagnostics', label: 'Diagnostics' },
        { key: 'treatment', label: 'Treatment Plans' },
        { key: 'notes', label: 'Case Notes' },
    ];

    return (
        <CommonTabLayout
            title="Case Details"
            basePath="/AllCases/:id"
            tabs={tabItems}
        />
    );
};

export default CaseDetails;
