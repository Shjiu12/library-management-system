
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function MainLayout() {
    return (
        <div className="d-flex min-vh-100 bg-light">           
            <Sidebar />
            <div className="flex-grow-1">
                
                <Navbar />
                <main className="container-fluid p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;
