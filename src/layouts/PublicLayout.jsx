import React from 'react';
import { Outlet } from 'react-router-dom';
import CardNav from '../pages/LandingPage/components/CardNav';

const PublicLayout = () => {
    return (
        <>
            <Outlet />
            <CardNav />
        </>
    );
};

export default PublicLayout;
