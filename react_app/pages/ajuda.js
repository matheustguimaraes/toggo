
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import Sidebar from '../components/Sidebar';
import ThemeToggleButton from '../components/ThemeToggleButton';
import { useTheme } from '../contexts/ThemeContext';
import SupportModal from '../components/SupportModal';
import LogoutConfirmationModal from '../components/LogoutConfirmationModal';

export default function AjudaPage() {
    const router = useRouter();
    const { toggleTheme } = useTheme();
    const { data: session } = useSession();

    const handleSignOut = () => signOut({ callbackUrl: '/login' });

    const [isSupportModalOpen, setSupportModalOpen] = useState(false);

    const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

    const handleSupportClick = () => {
        setSupportModalOpen(true);
    };

    return (
        <>
            <Head>
                <title>Toggo - Ajuda</title>
            </Head>
            <div className="page-layout page-with-fixed-sidebar">
                <Sidebar
                    activeItem="Ajuda"
                    onSignOutClick={() => setLogoutModalOpen(true)}
                />

                <main className="main-content help-page-content">
                    <header className="top-bar">
                        <h2 className="top-bar-title">Ajuda e Suporte</h2>
                    </header>
                    <div className="help-content-container">
                        <h2>Como podemos te ajudar?</h2>
                        <p>
                            Fale diretamente com nosso time de suporte.
                            <br />
                            Estamos aqui para te ajudar com qualquer dúvida sobre o uso do app.
                        </p>

                        <button onClick={handleSupportClick} className="support-button">
                            Entrar em contato com o suporte
                        </button>
                    </div>
                </main>
            </div>

            <ThemeToggleButton onToggle={toggleTheme} />
            <SupportModal isOpen={isSupportModalOpen} onClose={() => setSupportModalOpen(false)} />

            <LogoutConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setLogoutModalOpen(false)}
                onConfirm={handleSignOut}
            />
        </>
    );
}