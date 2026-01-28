import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import CardNav from '../pages/LandingPage/components/CardNav';

const PublicLayout = () => {
    const location = useLocation();

    return (
        <>
            <AnimatePresence>
                    <Outlet />
            </AnimatePresence>
            <CardNav />
        </>
    );
};

export default PublicLayout;
