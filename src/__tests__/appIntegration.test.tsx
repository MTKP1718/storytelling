import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from '../App';
import { ThemeMoodProvider } from '../context/ThemeMoodContext';

describe('App End-to-End Screen Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderApp = () => {
    return render(
      <ThemeMoodProvider>
        <App />
      </ThemeMoodProvider>
    );
  };

  it('renders landing page with navigation bar and character display', () => {
    renderApp();

    expect(screen.getByText(/Once Upon a Concept\.\.\./i)).toBeInTheDocument();
    expect(screen.getByText(/Story Teacher/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Custom Quest/i })).toBeInTheDocument();
  });

  it('allows navigating between tabs via Navbar', () => {
    renderApp();

    // Navigate to Library (150 Books) via Navbar
    const libraryNavBtns = screen.getAllByRole('button', { name: /^150 Books/i });
    fireEvent.click(libraryNavBtns[0]);
    expect(screen.getByRole('heading', { name: /150 Books to Read & Cherish/i })).toBeInTheDocument();

    // Navigate to Create Quest (New Quest)
    const createNavBtns = screen.getAllByRole('button', { name: /New Quest/i });
    fireEvent.click(createNavBtns[0]);
    expect(screen.getByText(/Step 2 of 4: Craft Your Quest/i)).toBeInTheDocument();

    // Navigate back to Home
    const homeNavBtns = screen.getAllByRole('button', { name: /Home/i });
    fireEvent.click(homeNavBtns[0]);
    expect(screen.getByText(/Once Upon a Concept\.\.\./i)).toBeInTheDocument();
  });

  it('toggles audio muting via Navbar audio button', () => {
    renderApp();

    const muteBtn = screen.getByTitle(/Mute Audio|Unmute Audio/i);
    expect(muteBtn).toBeInTheDocument();
    fireEvent.click(muteBtn);
  });

  it('opens and closes parent gate modal from Navbar', () => {
    renderApp();

    const parentBtns = screen.getAllByRole('button', { name: /Parents/i });
    // First parent button is in the top navbar
    fireEvent.click(parentBtns[0]);

    expect(screen.getByText(/Parent & Teacher Sanctum/i)).toBeInTheDocument();

    // Close button
    const closeBtn = screen.getByLabelText(/Close/i);
    fireEvent.click(closeBtn);

    expect(screen.queryByText(/Parent & Teacher Sanctum/i)).not.toBeInTheDocument();
  });

  it('adapts and loads StoryWeaver books directly into Reader from Library', () => {
    renderApp();

    // Go to Library
    const libraryNavBtns = screen.getAllByRole('button', { name: /^150 Books/i });
    fireEvent.click(libraryNavBtns[0]);

    // Find and click "Read Now"
    const readBtns = screen.getAllByRole('button', { name: /Read Now/i });
    if (readBtns.length > 0) {
      fireEvent.click(readBtns[0]);

      // Should now be on the reader screen
      expect(screen.getByText(/Quest Scroll • Chapter 1/i)).toBeInTheDocument();
    }
  });

  it('completes the entire adventure flow from landing to reward celebration', async () => {
    renderApp();

    // 1. Landing: Click "Create Custom Quest"
    const startQuestBtn = screen.getByRole('button', { name: /Create Custom Quest/i });
    fireEvent.click(startQuestBtn);

    // Wait for StoryConfigScreen
    await waitFor(() => {
      expect(screen.getByText(/Step 2 of 4: Craft Your Quest/i)).toBeInTheDocument();
    });

    // 2. Story Config: Click "Weave This Fairy Tale"
    const weaveBtn = screen.getByRole('button', { name: /Weave This Fairy Tale/i });
    fireEvent.click(weaveBtn);

    // Wait for Reader
    await waitFor(() => {
      expect(screen.getByText(/Quest Scroll • Chapter 1/i)).toBeInTheDocument();
    }, { timeout: 3500 });

    // 3. Reader: Turn pages
    const turnPageBtn = screen.getByRole('button', { name: /Turn Page/i });
    fireEvent.click(turnPageBtn);
    await waitFor(() => expect(screen.getByText(/Scroll 2 of 3/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /Turn Page/i }));
    await waitFor(() => expect(screen.getByText(/Scroll 3 of 3/i)).toBeInTheDocument());

    // On chapter 3, click "Word Magic"
    const wordMagicBtn = screen.getByRole('button', { name: /Play "Word Magic" Mini-Game!/i });
    fireEvent.click(wordMagicBtn);

    // 4. Word Magic Scramble: Click Skip to Quiz
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Skip to Quiz/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Skip to Quiz/i }));

    // 5. Quiz: Complete questions step-by-step
    await waitFor(() => {
      expect(screen.getByText(/1 of 3/i)).toBeInTheDocument();
    });

    // Q1
    await waitFor(() => expect(screen.getByText(/1 of 3/i)).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /3\/4 \(Three Quarters\)/i }));
    const nextBtn1 = await screen.findByRole('button', { name: /Next Trial/i });
    fireEvent.click(nextBtn1);

    // Q2
    await waitFor(() => expect(screen.getByText(/2 of 3/i)).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /2\/4 \(which equals 1\/2 or Half\)/i }));
    const nextBtn2 = await screen.findByRole('button', { name: /Next Trial/i });
    fireEvent.click(nextBtn2);

    // Q3
    await waitFor(() => expect(screen.getByText(/3 of 3/i)).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /The total number of equal parts/i }));
    const finishBtn = await screen.findByRole('button', { name: /Claim Your Hero Badge/i });
    fireEvent.click(finishBtn);

    // 6. Reward Screen Celebration
    await waitFor(() => {
      expect(screen.getByText(/Honor & Glory to/i)).toBeInTheDocument();
    }, { timeout: 4000 });

    // Reward screen actions
    expect(screen.getByRole('button', { name: /Embark on Another Quest/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Print Official Certificate/i })).toBeInTheDocument();
  }, 20000);
});
