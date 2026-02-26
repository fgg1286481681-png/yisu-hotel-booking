import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../views/LoginPage';
import { RegisterPage } from '../views/RegisterPage';
import { DashboardPage } from '../views/DashboardPage';
import { HotelFormPage } from '../views/HotelFormPage';
import { HotelReviewPage } from '../views/HotelReviewPage';
import { ProtectedRoute } from '../modules/auth/ProtectedRoute';
import { AdminRoute } from '../modules/auth/AdminRoute';

export function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/hotels/form"
                element={
                    <ProtectedRoute>
                        <HotelFormPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/hotels/review"
                element={
                    <AdminRoute>
                        <HotelReviewPage />
                    </AdminRoute>
                }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

