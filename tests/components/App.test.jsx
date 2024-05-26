import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from '../../src/App';

describe('App', () => {
    it('renders the app', async() => {
        render(<App />);
        
        screen.debug();

        const refreshButton = screen.getByRole('button', { name: /refresh/i });
        const heading = screen.getByRole('heading', { name: /best stories/i });
        const loadingButton = screen.getByRole('button', { name: /loading.../i });

        expect(refreshButton).toBeInTheDocument();
        expect(heading).toBeInTheDocument();
        expect(loadingButton).toBeInTheDocument();
        expect(loadingButton).toBeDisabled();

        await waitFor(() => {
            const stories = screen.getAllByRole('link', { name: /Story/i });
            expect(stories).toHaveLength(10);
        });

        // Load more stories.
        const loadMoreButton = screen.getByRole('button', { name: /load more/i });
        expect(loadMoreButton).toBeInTheDocument();
        fireEvent.click(loadMoreButton);

        await waitFor(() => {
            const stories = screen.getAllByRole('link', { name: /Story/i });
            expect(stories).toHaveLength(20);
        });

        // Refresh stories.
        fireEvent.click(refreshButton);
        await waitFor(() => {
            const stories = screen.getAllByRole('link', { name: /Story/i });
            expect(stories).toHaveLength(20);
        });
    });
});