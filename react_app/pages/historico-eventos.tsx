import Head from 'next/head';
import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';

import Sidebar from '../components/Sidebar';
import MyEventCard from '../components/MyEventCard';
import FilterMenu from '../components/FilterMenu';
import ThemeToggleButton from '../components/ThemeToggleButton';
import LogoutConfirmationModal from '../components/LogoutConfirmationModal';

import { useTheme } from '../contexts/ThemeContext';

interface Event {
    id: number;
    data_inicio: string;
    titulo: string;
    descricao: string;
    local: string;
}

interface HistoryEntry {
    participation_id: number;
    event: Event;
}

export default function HistoricoEventosPage() {
    const { data: session } = useSession();
    const { toggleTheme } = useTheme();

    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isFilterMenuOpen, setFilterMenuOpen] = useState(false);
    const [isAnimatingOut, setAnimatingOut] = useState(false);
    const [menuTitle, setMenuTitle] = useState('');
    const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

    const [fullHistory, setFullHistory] = useState<HistoryEntry[]>([]);
    const [filteredHistory, setFilteredHistory] = useState<HistoryEntry[]>([]);
    const [activeTimeFilter, setActiveTimeFilter] = useState('Todos');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (session) {
            const fetchHistory = async () => {
                setIsLoading(true);
                try {
                    const res = await fetch('/api/history');
                    if (!res.ok) {
                        throw new Error('Falha ao buscar os dados do histórico');
                    }
                    const data = await res.json();
                    setFullHistory(data);
                } catch (err) {
                    console.error('Erro ao carregar histórico:', err);
                    setFullHistory([]);
                }
                setIsLoading(false);
            };

            fetchHistory();
        }
    }, [session]);

    useEffect(() => {
        const today = new Date();
        let newFilteredList: HistoryEntry[] = [];
        
        if (activeTimeFilter === 'Todos') {
            newFilteredList = fullHistory;
        } else {
            newFilteredList = fullHistory.filter(entry => {
                const eventDate = new Date(entry.event.data_inicio);
                if (activeTimeFilter === 'Semana') {
                    const oneWeekAgo = new Date(today);
                    oneWeekAgo.setDate(today.getDate() - 7);
                    return eventDate >= oneWeekAgo && eventDate <= today;
                }
                if (activeTimeFilter === 'Mês') {
                    return eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear();
                }
                if (activeTimeFilter === 'Ano') {
                    return eventDate.getFullYear() === today.getFullYear();
                }
                return false;
            });
        }
        setFilteredHistory(newFilteredList);
    }, [activeTimeFilter, fullHistory]);

    const handleSignOut = () => signOut({ callbackUrl: '/login' });
    
    const openSideMenu = (title: string) => { 
        setMenuTitle(title); 
        setFilterMenuOpen(true); 
    };
    
    const handleCloseMenu = () => {
        setAnimatingOut(true);
        setTimeout(() => {
            setFilterMenuOpen(false);
            setAnimatingOut(false);
        }, 300);
    };
    
    const handleDetailsClick = (event: Event) => { 
        setSelectedEvent(event); 
        openSideMenu('Detalhes do evento'); 
    };

    return (
        <>
            <Head>
                <title>Toggo - Histórico de Eventos</title>
            </Head>
            <div className="page-layout page-with-flex-sidebar">
                <Sidebar
                    activeItem="Histórico de eventos"
                    onSignOutClick={() => setLogoutModalOpen(true)}
                />

                <main className="my-events-main-content">
                    <header className="my-events-top-bar">
                        <div className="back-and-title">
                            <h1>Histórico de Eventos</h1>
                        </div>
                        <div className="top-bar-actions">
                        </div>
                    </header>

                    <div className="time-filter-container">
                        <button 
                            className={`time-filter-button ${activeTimeFilter === 'Todos' ? 'active' : ''}`} 
                            onClick={() => setActiveTimeFilter('Todos')}
                        >
                            Todos
                        </button>
                        <button 
                            className={`time-filter-button ${activeTimeFilter === 'Semana' ? 'active' : ''}`} 
                            onClick={() => setActiveTimeFilter('Semana')}
                        >
                            Semana
                        </button>
                        <button 
                            className={`time-filter-button ${activeTimeFilter === 'Mês' ? 'active' : ''}`} 
                            onClick={() => setActiveTimeFilter('Mês')}
                        >
                            Mês
                        </button>
                        <button 
                            className={`time-filter-button ${activeTimeFilter === 'Ano' ? 'active' : ''}`} 
                            onClick={() => setActiveTimeFilter('Ano')}
                        >
                            Ano
                        </button>
                    </div>

                    <div className="my-events-list">
                        {isLoading ? (
                            <p>Carregando histórico...</p>
                        ) : filteredHistory.length > 0 ? (
                            filteredHistory.map(entry => (
                                <MyEventCard
                                    key={entry.participation_id}
                                    event={entry.event}
                                    onDetailsClick={() => handleDetailsClick(entry.event)}
                                />
                            ))
                        ) : (
                            <p>Você ainda não participou de nenhum evento.</p>
                        )}
                    </div>
                </main>
            </div>

            <FilterMenu
                isOpen={isFilterMenuOpen}
                isClosing={isAnimatingOut}
                onClose={handleCloseMenu}
                menuTitle={menuTitle}
                selectedEvent={selectedEvent}
            />

            <LogoutConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setLogoutModalOpen(false)}
                onConfirm={handleSignOut}
            />

            <ThemeToggleButton onToggle={toggleTheme} />
        </>
    );
} 