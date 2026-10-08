import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HeroLandingScreen } from '../components/HeroLandingScreen';
import { StoryConfigScreen } from '../components/StoryConfigScreen';
import { ParentDashboard } from '../components/ParentDashboard';
import type { ChildProfile } from '../types';
import { MOCK_STORIES } from '../data/mockStories';

describe('Topic & Age Input Validation', () => {
  const mockProfile: ChildProfile = {
    name: 'Oliver',
    avatar: 'starlight_wizard',
    age: 8,
    ageGroup: '6-8',
    readingMode: 'read_to_me',
    totalStars: 5,
    earnedBadges: [MOCK_STORIES[0].badge],
    history: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('HeroLandingScreen - Age & Profile Validation', () => {
    it('renders initial profile values correctly', () => {
      render(
        <HeroLandingScreen
          childProfile={mockProfile}
          onUpdateProfile={vi.fn()}
          onNavigate={vi.fn()}
          onOpenParentGate={vi.fn()}
        />
      );

      const nameInput = screen.getByPlaceholderText(/Enter adventurer's name/i) as HTMLInputElement;
      expect(nameInput.value).toBe('Oliver');
      expect(screen.getByText(/Age 8 Years Old/i)).toBeInTheDocument();
      expect(screen.getByText(/Level: Budding Adventurer/i)).toBeInTheDocument();
    });

    it('falls back to "Young Explorer" if name is left blank or whitespace on submission', async () => {
      const onUpdateProfile = vi.fn();
      const onNavigate = vi.fn();

      render(
        <HeroLandingScreen
          childProfile={{ ...mockProfile, name: '' }}
          onUpdateProfile={onUpdateProfile}
          onNavigate={onNavigate}
          onOpenParentGate={vi.fn()}
        />
      );

      const nameInput = screen.getByPlaceholderText(/Enter adventurer's name/i);
      fireEvent.change(nameInput, { target: { value: '   ' } });

      const startButton = screen.getByRole('button', { name: /Create Custom Quest/i });
      fireEvent.click(startButton);

      expect(onUpdateProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Young Explorer',
          age: 8,
          ageGroup: '6-8',
        })
      );
    });

    it('submits customized name correctly', () => {
      const onUpdateProfile = vi.fn();

      render(
        <HeroLandingScreen
          childProfile={mockProfile}
          onUpdateProfile={onUpdateProfile}
          onNavigate={vi.fn()}
          onOpenParentGate={vi.fn()}
        />
      );

      const nameInput = screen.getByPlaceholderText(/Enter adventurer's name/i);
      fireEvent.change(nameInput, { target: { value: 'Aria' } });

      const startButton = screen.getByRole('button', { name: /Create Custom Quest/i });
      fireEvent.click(startButton);

      expect(onUpdateProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Aria',
        })
      );
    });

    it('validates age selection and updates age group tiers accurately', () => {
      const onUpdateProfile = vi.fn();

      render(
        <HeroLandingScreen
          childProfile={mockProfile}
          onUpdateProfile={onUpdateProfile}
          onNavigate={vi.fn()}
          onOpenParentGate={vi.fn()}
        />
      );

      // Select Age 7 -> group 6-8 (Budding Adventurer)
      const age7Btn = screen.getByRole('button', { name: /^7\s*yr/i });
      fireEvent.click(age7Btn);
      expect(screen.getByText(/Age 7 Years Old/i)).toBeInTheDocument();
      expect(screen.getByText(/Level: Budding Adventurer/i)).toBeInTheDocument();

      // Select Age 10 -> group 9-10 (Concept Quest Master)
      const age10Btn = screen.getByRole('button', { name: /^10\s*yr/i });
      fireEvent.click(age10Btn);
      expect(screen.getByText(/Age 10 Years Old/i)).toBeInTheDocument();
      expect(screen.getByText(/Level: Concept Quest Master/i)).toBeInTheDocument();

      // Select Age 12 -> group 11-12 (Grand Scholar of Arboria)
      const age12Btn = screen.getByRole('button', { name: /^12\s*yr/i });
      fireEvent.click(age12Btn);
      expect(screen.getByText(/Age 12 Years Old/i)).toBeInTheDocument();
      expect(screen.getByText(/Level: Grand Scholar of Arboria/i)).toBeInTheDocument();

      // Submitting age 12 should pass age 12 and group 11-12
      const startButton = screen.getByRole('button', { name: /Create Custom Quest/i });
      fireEvent.click(startButton);

      expect(onUpdateProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          age: 12,
          ageGroup: '11-12',
        })
      );
    });

    it('filters avatars by category and allows avatar selection', () => {
      const onUpdateProfile = vi.fn();

      render(
        <HeroLandingScreen
          childProfile={mockProfile}
          onUpdateProfile={onUpdateProfile}
          onNavigate={vi.fn()}
          onOpenParentGate={vi.fn()}
        />
      );

      // Filter by "companion" category
      const companionFilter = screen.getByRole('button', { name: /^companion$/i });
      fireEvent.click(companionFilter);

      // Barnaby or Scholar Owl should be visible
      const owlBtn = screen.getByRole('button', { name: /Barnaby|Orion/i });
      fireEvent.click(owlBtn);

      const startButton = screen.getByRole('button', { name: /Create Custom Quest/i });
      fireEvent.click(startButton);

      expect(onUpdateProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          avatar: expect.any(String),
        })
      );
    });

    it('navigates to 150 books collection and opens parent gate', () => {
      const onNavigate = vi.fn();
      const onOpenParentGate = vi.fn();

      render(
        <HeroLandingScreen
          childProfile={mockProfile}
          onUpdateProfile={vi.fn()}
          onNavigate={onNavigate}
          onOpenParentGate={onOpenParentGate}
        />
      );

      const booksBtn = screen.getByRole('button', { name: /Explore 150 Books/i });
      fireEvent.click(booksBtn);
      expect(onNavigate).toHaveBeenCalledWith('library');

      const parentGateBtn = screen.getByRole('button', { name: /Parents & Teachers: View Progress/i });
      fireEvent.click(parentGateBtn);
      expect(onOpenParentGate).toHaveBeenCalled();
    });
  });

  describe('StoryConfigScreen - Topic & Theme Validation', () => {
    it('selects preset topics and handles custom topic inputs', async () => {
      const onSelectStory = vi.fn();
      const onNavigate = vi.fn();

      render(
        <StoryConfigScreen
          childProfile={mockProfile}
          onSelectStory={onSelectStory}
          onNavigate={onNavigate}
          onUpdateReadingMode={vi.fn()}
        />
      );

      // Verify preset topic selection
      const gravityPreset = screen.getByText(/Gravity & The Invisible Pull/i);
      fireEvent.click(gravityPreset);

      // Custom topic input field
      const customInput = screen.getByPlaceholderText(/Volcanoes, Long Division/i);
      fireEvent.change(customInput, { target: { value: 'Volcanoes & Magma Chambers' } });

      // Submitting should weave story with custom topic
      const beginBtn = screen.getByRole('button', { name: /Weave This Fairy Tale/i });
      fireEvent.click(beginBtn);

      await waitFor(() => {
        expect(onSelectStory).toHaveBeenCalledWith(
          expect.objectContaining({
            topic: 'Volcanoes & Magma Chambers',
            targetAge: '6-8',
          })
        );
        expect(onNavigate).toHaveBeenCalledWith('reader');
      }, { timeout: 3000 });
    });

    it('handles whitespace-only custom topic by falling back cleanly to selected preset topic', async () => {
      const onSelectStory = vi.fn();
      const onNavigate = vi.fn();

      render(
        <StoryConfigScreen
          childProfile={mockProfile}
          onSelectStory={onSelectStory}
          onNavigate={onNavigate}
          onUpdateReadingMode={vi.fn()}
        />
      );

      const customInput = screen.getByPlaceholderText(/Volcanoes, Long Division/i);
      fireEvent.change(customInput, { target: { value: '   ' } });

      const beginBtn = screen.getByRole('button', { name: /Weave This Fairy Tale/i });
      fireEvent.click(beginBtn);

      await waitFor(() => {
        expect(onSelectStory).toHaveBeenCalled();
        expect(onNavigate).toHaveBeenCalledWith('reader');
      }, { timeout: 3000 });
    });

    it('toggles reading mode between read_to_me and read_myself', () => {
      const onUpdateReadingMode = vi.fn();

      render(
        <StoryConfigScreen
          childProfile={mockProfile}
          onSelectStory={vi.fn()}
          onNavigate={vi.fn()}
          onUpdateReadingMode={onUpdateReadingMode}
        />
      );

      const readMyselfBtn = screen.getByRole('button', { name: /I'll Read Solo/i });
      fireEvent.click(readMyselfBtn);
      expect(onUpdateReadingMode).toHaveBeenCalledWith('read_myself');

      const readToMeBtn = screen.getByRole('button', { name: /Read to Me/i });
      fireEvent.click(readToMeBtn);
      expect(onUpdateReadingMode).toHaveBeenCalledWith('read_to_me');
    });
  });

  describe('ParentDashboard - Gate Authentication Validation', () => {
    it('rejects incorrect PIN and math solutions with helpful error', () => {
      render(
        <ParentDashboard
          childProfile={mockProfile}
          isOpen={true}
          onClose={vi.fn()}
          onOpenPrintCertificate={vi.fn()}
        />
      );

      const pinInput = screen.getByPlaceholderText(/Enter 4-digit PIN/i);
      fireEvent.change(pinInput, { target: { value: '9999' } });

      const unlockBtn = screen.getByRole('button', { name: /Unlock Insights/i });
      fireEvent.click(unlockBtn);

      expect(screen.getByText(/Incorrect PIN or math answer\. Please try again!/i)).toBeInTheDocument();
    });

    it('unlocks dashboard when entering default PIN 1234', () => {
      render(
        <ParentDashboard
          childProfile={mockProfile}
          isOpen={true}
          onClose={vi.fn()}
          onOpenPrintCertificate={vi.fn()}
        />
      );

      const pinInput = screen.getByPlaceholderText(/Enter 4-digit PIN/i);
      fireEvent.change(pinInput, { target: { value: '1234' } });

      const unlockBtn = screen.getByRole('button', { name: /Unlock Insights/i });
      fireEvent.click(unlockBtn);

      expect(screen.queryByText(/Incorrect PIN/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Learning & Skill Insights/i)).toBeInTheDocument();
    });

    it('unlocks dashboard when entering correct math solution (8 x 7 = 56)', () => {
      render(
        <ParentDashboard
          childProfile={mockProfile}
          isOpen={true}
          onClose={vi.fn()}
          onOpenPrintCertificate={vi.fn()}
        />
      );

      const mathInput = screen.getByPlaceholderText(/Answer/i);
      fireEvent.change(mathInput, { target: { value: '56' } });

      const unlockBtn = screen.getByRole('button', { name: /Unlock Insights/i });
      fireEvent.click(unlockBtn);

      expect(screen.getByText(/Learning & Skill Insights/i)).toBeInTheDocument();
    });
  });
});
