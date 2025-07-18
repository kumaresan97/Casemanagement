import * as React from 'react';
import { Tag, Tooltip } from 'antd';
import type { TagProps } from 'antd';

interface EllipsisTagProps extends TagProps {
    label: string;
    width?: number;
    maxWidth?: number;
    statusKey?: string; // Optional: use for dynamic logic
}

const getTagStyle = (label: string): React.CSSProperties => {
    const lower = label.toLowerCase();

    if (lower.includes('pending')) {
        return { background: '#f7f0dc', color: '##584206' }; // orange
    } else if (lower.includes('completed')) {
        return { background: '#ddf8e6', color: '#06580B' }; // teal
    } else if (lower.includes('cancelled')) {
        return { background: '#f8ddde', color: '#580607' }; // red
    } else {
        return { background: '#FFFAEA', color: '#333' }; // default
    }
};

const EllipsisTag: React.FC<EllipsisTagProps> = ({
    label,
    width,
    maxWidth = 120,
    style,
    statusKey,
    ...rest
}) => {
    const colorStyle = getTagStyle(label);

    return (
        <Tooltip title={label}>
            <Tag
                {...rest}
                style={{
                    ...colorStyle,
                    width: width ?? 100,

                    // borderRadius: 2,
                    maxWidth,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    display: 'inline-block',
                    padding: '2px 8px',
                    fontSize: 13,
                    ...style,
                }}
            >
                {label}
            </Tag>
        </Tooltip>
    );
};

export default EllipsisTag;
