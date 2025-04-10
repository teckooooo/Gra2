import React from 'react';

interface ApplicationLogoProps {
    className?: string;
}

export default function ApplicationLogo(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/logo.png"
            alt="CableColor Logo"
            {...props}
        />
    );
}
