import type { ReactNode } from 'react';

interface PageLayoutProps {
    children: ReactNode;
    title: string;
}

const PageLayout = ({ children, title }: PageLayoutProps) => {
    return (
        <main className="main-content" style={{ marginTop: '100px', marginBottom: '60px' }}>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="page-title text-center mb-4">{title}</h1>
                        {children}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default PageLayout;