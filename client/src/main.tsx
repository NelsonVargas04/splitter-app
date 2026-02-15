import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import PageLogin from '@/components/Page/PageLogin'
import PageVerify from '@/components/Page/PageVerify'
import PageRegister from '@/components/Page/PageRegister'
import PageDashboard from '@/components/Page/PageDashboard'
import PageEventDetail from '@/components/Page/PageEventDetail'
import PageProfile from '@/components/Page/PageProfile'
import PageGroups from '@/components/Page/PageGroups'
import PageQR from '@/components/Page/PageQR'
import useStoreTheme from '@/stores/StoreTheme'

const AppContent = () => {
	const { mode } = useStoreTheme();
	
	const theme = createTheme({
		palette: {
			mode,
			primary: {
				main: '#7c4dff',
			},
			secondary: {
				main: '#5e35b1',
			},
			background: {
				default: mode === 'dark' ? '#121212' : '#f5f5f5',
				paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
			},
		},
		typography: {
			fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
		},
		shape: {
			borderRadius: 12,
		},
	});

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<BrowserRouter>
				<Routes>
					<Route path="/login" element={<PageLogin />} />
					<Route path="/verify" element={<PageVerify />} />
					<Route path="/register" element={<PageRegister />} />
					<Route path="/dashboard" element={<PageDashboard />} />
					<Route path="/event/:id" element={<PageEventDetail />} />
					<Route path="/profile" element={<PageProfile />} />
					<Route path="/groups" element={<PageGroups />} />
					<Route path="/qr" element={<PageQR />} />
					<Route path="/" element={<Navigate to="/login" replace />} />
					<Route path="*" element={<Navigate to="/login" replace />} />
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
};

createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<AppContent />
	</React.StrictMode>
)
