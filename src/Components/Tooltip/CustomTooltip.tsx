// components/CustomTooltip.tsx
import * as React from 'react';
import { Tooltip } from 'antd';
import type { TooltipPlacement } from 'antd/es/tooltip';
import Skeleton from 'antd/es/skeleton';

interface CustomTooltipProps {
    title: React.ReactNode;
    children: React.ReactNode;
    placement?: TooltipPlacement;
    isLoading?: boolean;
    width?: number | string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
    title,
    children,
    placement = 'top',
    isLoading = false,
    width = 150,
}) => {
    const content = isLoading ? (
        <Skeleton active paragraph={false} title={{ width }} />
    ) : (
        <div style={{ maxWidth: width }}>{title}</div>
    );

    return (
        <Tooltip title={content} placement={placement}>
            <span>{children}</span>
        </Tooltip>
    );
};

export default CustomTooltip;
